// Get data from LocalStorage

let transactions =
    JSON.parse(localStorage.getItem("transactions")) || [];


// Get HTML elements

let form = document.getElementById("transactionForm");

let type = document.getElementById("type");

let amount = document.getElementById("amount");

let description = document.getElementById("description");

let category = document.getElementById("category");

let date = document.getElementById("date");

let month = document.getElementById("month");

let search = document.getElementById("search");

let filterType = document.getElementById("filterType");

let filterCategory = document.getElementById("filterCategory");

let transactionList =
    document.getElementById("transactionList");


// Set current date

let today = new Date();

date.value = today.toISOString().split("T")[0];


// Set current month

month.value = today.toISOString().slice(0, 7);


// Add Transaction

form.addEventListener("submit", function(event) {

    event.preventDefault();


    let transaction = {

        id: Date.now(),

        type: type.value,

        amount: Number(amount.value),

        description: description.value,

        category: category.value,

        date: date.value

    };


    transactions.push(transaction);


    // Save data

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );


    form.reset();

    date.value =
        new Date().toISOString().split("T")[0];


    showTransactions();

});


// Show Transactions

function showTransactions() {

    transactionList.innerHTML = "";


    let selectedMonth = month.value;


    let filteredTransactions =
        transactions.filter(function(transaction) {

            return transaction.date.startsWith(
                selectedMonth
            );

        });


    // Search

    let searchText =
        search.value.toLowerCase();


    filteredTransactions =
        filteredTransactions.filter(function(transaction) {

            return transaction.description
                .toLowerCase()
                .includes(searchText);

        });


    // Filter Type

    if (filterType.value != "all") {

        filteredTransactions =
            filteredTransactions.filter(function(transaction) {

                return transaction.type ==
                    filterType.value;

            });

    }


    // Filter Category

    if (filterCategory.value != "all") {

        filteredTransactions =
            filteredTransactions.filter(function(transaction) {

                return transaction.category ==
                    filterCategory.value;

            });

    }


    // Display

    filteredTransactions.forEach(function(transaction) {

        let row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${transaction.date}</td>

            <td>${transaction.description}</td>

            <td>${transaction.category}</td>

            <td>${transaction.type}</td>

            <td>₹${transaction.amount}</td>

            <td>

                <button
                    class="edit-btn"
                    onclick="editTransaction(${transaction.id})"
                >
                    Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteTransaction(${transaction.id})"
                >
                    Delete
                </button>

            </td>

        `;


        transactionList.appendChild(row);

    });


    calculateTotal();

}


// Calculate Income, Expense and Balance

function calculateTotal() {

    let selectedMonth = month.value;


    let monthlyTransactions =
        transactions.filter(function(transaction) {

            return transaction.date.startsWith(
                selectedMonth
            );

        });


    let totalIncome = 0;

    let totalExpense = 0;


    monthlyTransactions.forEach(function(transaction) {

        if (transaction.type == "income") {

            totalIncome += transaction.amount;

        } else {

            totalExpense += transaction.amount;

        }

    });


    let balance =
        totalIncome - totalExpense;


    document.getElementById("income").innerText =
        "₹" + totalIncome;

    document.getElementById("expense").innerText =
        "₹" + totalExpense;

    document.getElementById("balance").innerText =
        "₹" + balance;

}


// Delete Transaction

function deleteTransaction(id) {

    let confirmDelete =
        confirm("Delete this transaction?");


    if (confirmDelete) {

        transactions =
            transactions.filter(function(transaction) {

                return transaction.id != id;

            });


        localStorage.setItem(
            "transactions",
            JSON.stringify(transactions)
        );


        showTransactions();

    }

}


// Edit Transaction

function editTransaction(id) {

    let transaction =
        transactions.find(function(transaction) {

            return transaction.id == id;

        });


    if (!transaction) {
        return;
    }


    type.value =
        transaction.type;

    amount.value =
        transaction.amount;

    description.value =
        transaction.description;

    category.value =
        transaction.category;

    date.value =
        transaction.date;


    // Remove old transaction

    transactions =
        transactions.filter(function(item) {

            return item.id != id;

        });


    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );


    showTransactions();


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// Search

search.addEventListener(
    "input",
    showTransactions
);


// Filter Type

filterType.addEventListener(
    "change",
    showTransactions
);


// Filter Category

filterCategory.addEventListener(
    "change",
    showTransactions
);


// Change Month

month.addEventListener(
    "change",
    showTransactions
);


// Start project

showTransactions();