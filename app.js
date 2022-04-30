import { fetchMovieAvailability, fetchMovieList } from "./api.js";

const main = document.querySelector("main");
const nav = document.querySelector('nav');
const btn = document.getElementById('book-ticket-btn');
let seatBooked = [];

fetchingMovie();
loader(1);
function loader(flag) {
  let loading = document.createElement("div");
  if (flag === 1) {
    loading.id = "loader";
    nav.after(loading);
    loading.textContent = "Loading...";
  } else {
    let loader = document.getElementById("loader");
    loader.remove();
  }
}
async function fetchingMovie() {
  const movie = await fetchMovieList();
  loader(0);
  addList(movie);
}

function addList(lists) {
  let holder = document.createElement("div");
  holder.classList.add("movie-holder");
  main.appendChild(holder);

  let newChildHtml = "";
  lists.forEach((list) => {
    newChildHtml =
      `<a class="movie-link" href='javascript:${() => clickHandler(list.name)}'>
         <div class="movie" data-d="${list.name}"
         >
         <div class="movie-img-wrapper" style="background-image:url('${
           list.imgUrl
         }')">
         </div>
         <h4>$${list.name}</h4>
         </div>
         </a>` + newChildHtml;
  });
  holder.innerHTML = newChildHtml;

  let anchor = document.querySelectorAll(".movie-link");
  let n = anchor.length;
  for (let i = 0; i < n; i++) {
    anchor[i].addEventListener("click", (e) => {
      e.preventDefault();
      clickHandler(lists[n - 1 - i].name);
    });
  }
}

function seatAvailable(lists) {
  let h3 = document.querySelector("#booker > h3");
  h3.style.visibility = "visible";
 
  
  let grids = document.querySelector("#booker-grid-holder");
  grids.innerHTML = "";
  for (let i = 0; i < 2; i++) {
    let grid = document.createElement("div");
    grid.classList.add("booking-grid");
    grids.appendChild(grid);
  }
  seat(lists);
}

function seat(lists) {
  const grid = document.querySelectorAll(".booking-grid");
  for (let i = 1; i < 13; i++) {
    let cell = document.createElement("div");
    cell.id = "booking-grid-" + i;
    grid[0].appendChild(cell);
    cell.textContent = i;
    if (lists.includes(i)) {
      cell.classList.add("available-seat");
      cell.addEventListener("click", (e) => {
        bookingSeat(i);
      });
    } else {
      cell.classList.add("unavailable-seat");
    }
  }
  for (let i = 13; i < 25; i++) {
    let cell = document.createElement("div");
    cell.id = "booking-grid-" + i;
    grid[1].appendChild(cell);
    cell.textContent = i;
    if (lists.includes(i)) {
      cell.classList.add("available-seat");
      cell.addEventListener("click", (e) => {
        bookingSeat(i);
      });
    } else {
      cell.classList.add("unavailable-seat");
    }
  }
}

async function fetchSeat(movieName) {
  const avialableSeat = await fetchMovieAvailability(movieName);
  seatAvailable(avialableSeat);
}

function clickHandler(moviename) {
  fetchSeat(moviename);
}

function bookingSeat(id) {
  let cell = document.getElementById('booking-grid-'+id);
  if (!seatBooked.includes(id)) {
    cell.classList.add("selected-seat");
    seatBooked.push(id);
    confirmSeatBtn();
  } else {
    cell.classList.remove("selected-seat");
    seatBooked = seatBooked.filter(list=>list!==id);
    confirmSeatBtn();
  }
}

function confirmSeatBtn(){
  if(seatBooked.length!==0){
  btn.classList.remove('v-none');
  }else{
  btn.classList.add('v-none');
  }
}


function purchaseSection(){
  let confirm = document.createElement('div');
  confirm.id = 'confirm-purchase';
  const booker = document.getElementById('booker');
  booker.innerHTML="";

  let newChildHtml = `<h3>Confirm your booking for seat numbers: ${seatBooked.join(", ")}</h3><form id="customer-detail-form">
  <label for="email">Email : </label>
  <input type="email" id="email" required/><br>
  <label for="phone">Phone Number : </label>
  <input type="tel" id="phone" required/><br>
  <button type='submit'/>Purchase</button></form>`;

  confirm.innerHTML=newChildHtml;
  booker.appendChild(confirm);

  let form = document.getElementById('customer-detail-form');
  form.addEventListener('submit',(e)=>{
    e.preventDefault();
    submitHandler();
  })
}

function submitHandler(){
 const email = document.getElementById('email').value;
 const phone = document.getElementById('phone').value;

 purchaseDetail(email,phone);
}

function purchaseDetail(email,phone){
  let success = document.createElement('div');
   success.id="Success";
  const booker = document.getElementById('booker');
  booker.innerHTML="";
  booker.appendChild(success);

   
   const newChildHtml=`<h4>Booking details</h4>
   <p>Seats : ${seatBooked.join(", ")}</p>
   <p>Phone Number : ${phone}</p>
   <p>Email : ${email}</p>
   `;

   success.innerHTML= newChildHtml;
}

btn.addEventListener('click',purchaseSection);
