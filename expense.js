const amount = document.querySelector("#amount");
const description = document.querySelector("#description");
const category = document.querySelector("#category");
const ulItems = document.querySelector(".item-list");
const form = document.querySelector("#form");
const buyButton = document.querySelector("#rzp-btn1");
const buyText = document.querySelector("#premium-p");

const leaderBoard = document.querySelector("#leader-board");

const api = "http://localhost:3000/expense";

async function onSubmit(e) {
  e.preventDefault();

  const expDets = {
    amount: amount.value,
    description: description.value,
    category: category.value,
  };
  const token = localStorage.getItem("token");
  // { headers: { Authorization: token } }
  await axios.post(`${api}/addExpense`, expDets, {
    headers: { Authorization: token },
  });

  //   li(expDets);
}

function delButton(obj) {
  const delBtn = document.createElement("button");
  delBtn.className = "del-btn";
  delBtn.appendChild(document.createTextNode("Delete Expense"));

  delBtn.addEventListener("click", (e) => deleteBtn(e, obj));

  async function deleteBtn(e, obj) {
    // const exDet = await axios.get(`${api}/getExpenses`);
    // const expObj = exDet.data.expenses.find((d) => d.id === obj.id);

    const token = localStorage.getItem("token");

    let li = e.target.parentElement;
    await axios.delete(`${api}/deleteExpense/${obj.id}`, {
      headers: { Authorization: token },
    });
    ulItems.removeChild(li);
  }

  return delBtn;
}

function li(obj) {
  const li = document.createElement("li");
  li.className = "items";
  li.appendChild(delButton(obj));
  li.appendChild(
    document.createTextNode(`${obj.amount} ${obj.description} ${obj.category}`)
  );
  ulItems.appendChild(li);
}

form.addEventListener("submit", onSubmit);

window.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(`${api}/getExpenses`, {
    headers: { Authorization: token },
  });

  if (response.data.expenses.length !== 0) {
    for (let i = 0; i < response.data.expenses.length; i++) {
      li(response.data.expenses[i]);
    }
  }

  if (response.data.userDetails.ispremiumuser) {
    buyButton.style.display = "none";
    buyText.style.display = "";
    buyText.innerHTML = "You are a premium user now";
    // document.body.innerHTML += `<div> You are premium user now</div>`;
  }
});

document.getElementById("rzp-btn1").onclick = async function (e) {
  //
  const token = localStorage.getItem("token");

  const response = await axios.get(
    "http://localhost:3000/purchase/premiummembership",
    { headers: { Authorization: token } }
  );

  var options = {
    key: response.data.key_id, // Enter the Key Id generated from the Dashboard
    order_id: response.data.order.id, // This handler function will handle the success payment
    handler: async function (response) {
      await axios.post(
        "http://localhost:3000/purchase/updatetransactionstatus",
        {
          order_id: options.order_id,
          payment_id: response.razorpay_payment_id,
        },
        { headers: { Authorization: token } }
      );
      alert("You are a Premium User Now");
      if (response.status === 203) {
        buyButton.style.display = "none";
        buyText.innerHTML = "You are premium user now";
        // document.body.innerHTML += `<div> You are premium user now</div>`;
      }
    },
  };

  const rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();
  rzp1.on("payment.failed", function (response) {
    alert("Something went wrong");
  });
};

leaderBoard.addEventListener("click", async () => {
  const responses = await axios.get(
    "http://localhost:3000/premium/showLeaderBoard"
  );
  console.log(responses);
  console.log(responses.data.results[0]);
  var div = document.getElementById("leader-board-list");

  if (responses.data.results.length > 0) {
    for (let i = 0; i < responses.data.results.length; i++) {
      const li = document.createElement("li");
      li.className = "leader-board-item";
      document.getElementById("board-list").style.display = "block";
      li.textContent = `Name- ${responses.data.results[i].name} Total Expense  ${responses.data.results[i].totalExpense}`;

      div.appendChild(li);
    }
  }
});
