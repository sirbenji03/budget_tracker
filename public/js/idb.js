let db;
// create a new db request for a "budget" database.
const request = indexedDB.open('budget', 1);

request.onupgradeneeded = function (event) {
  // create object store called "pending" and set autoIncrement to true
  const db = event.target.result;
  db.createObjectStore("new_transaction", { autoIncrement: true });
};

request.onsuccess = function (event) {
  db = event.target.result;

 
  if (navigator.onLine) {
    checkDatabase();
  }
};

request.onerror = function (event) {
  console.log("sorry! " + event.target.errorCode);
};

function saveRecord(record) {
 
  const transaction = db.transaction(["new_transaction"], "readwrite");


  const store = transaction.objectStore("new_transaction");

 
  store.add(record);
}

function checkDatabase() {
 
  const transaction = db.transaction(["new_transaction"], "readwrite");

  
  const store = transaction.objectStore("new_transaction");

  
  const getAll = store.getAll();

  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then(() => {
          
          const transaction = db.transaction(["new_transaction"], "readwrite");

       
          const store = transaction.objectStore("new_transaction");

        
          store.clear();
        });
    }
  };
}


window.addEventListener("online", checkDatabase);