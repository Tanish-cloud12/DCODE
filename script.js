let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

const form = document.getElementById("expenseForm");
const list = document.getElementById("expenseList");
const totalEl = document.getElementById("total");

function updateTotal() {
  let total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  totalEl.textContent = total;
}

function saveExpenses() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

function renderExpenses() {
  list.innerHTML = "";
  expenses.forEach((exp, index) => {
    let li = document.createElement("li");
    li.innerHTML = `
      <span>${exp.title} - ₹${exp.amount} (${exp.category})</span>
      <div>
        <button class="edit-btn" onclick="editExpense(${index})">Edit</button>
        <button class="delete-btn" onclick="deleteExpense(${index})">Delete</button>
      </div>
    `;
    list.appendChild(li);
  });
  updateTotal();
  saveExpenses();
}

form.addEventListener("submit", e => {
  e.preventDefault();
  let title = document.getElementById("title").value;
  let amount = parseFloat(document.getElementById("amount").value);
  let category = document.getElementById("category").value;

  expenses.push({ title, amount, category });
  renderExpenses();

  form.reset();
});

function deleteExpense(index) {
  expenses.splice(index, 1);
  renderExpenses();
}

function editExpense(index) {
  let exp = expenses[index];
  document.getElementById("title").value = exp.title;
  document.getElementById("amount").value = exp.amount;
  document.getElementById("category").value = exp.category;
  deleteExpense(index); 
}

renderExpenses();


document.getElementById("downloadPDF").addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("My Expense Report", 20, 20);

  let y = 40;
  expenses.forEach((exp, i) => {
    doc.text(`${i + 1}. ${exp.title} - ₹${exp.amount} (${exp.category})`, 20, y);
    y += 10;
  });

  doc.text(`Total: ₹${expenses.reduce((sum, e) => sum + e.amount, 0)}`, 20, y + 10);

  doc.save("expenses.pdf");
});


document.getElementById("downloadExcel").addEventListener("click", () => {
  let data = expenses.map(exp => ({
    Title: exp.title,
    Amount: exp.amount,
    Category: exp.category
  }));

  let worksheet = XLSX.utils.json_to_sheet(data);
  let workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");

  XLSX.writeFile(workbook, "expenses.xlsx");
});
