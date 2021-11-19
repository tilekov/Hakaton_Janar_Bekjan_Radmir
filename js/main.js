const API = "http://localhost:7000/posts";
const modal = $("#my_modal");
const modal2 = $("#my_modal2");
const modal3 = $("#my_modal3");
const modal_inp = $("#my_modal_inp");
const btn = $("#btn_modal_window");
const span = $(".close_modal_window");
let editedId = null;
let likedId = null;
let searchText = "";
let pageCount = 1;
let page = 1;

renderPost();
// $("#add-yes").on("click", function () {
//   let newPost = {
//     content: $(".inp_post").val(),
//   };
//   postNew(newPost);
//   $(".inp_post").val("");
// });

$("#add_btn").on("click", function () {
    let newPost = {
        content: $(".inp_post").val(),
    };
    postNew(newPost);
    $(".inp_post").val("");
    modal3.css('display', 'none')
});
function postNew(newPost) {
  if ($(".inp_post").val() == "") {
    alert("Заполните поле");
    $(".inp_post").val("");
    return;
  }
  fetch(API, {
    method: "POST",
    body: JSON.stringify(newPost),
    headers: {
      "Content-Type": "application/json",
    },
  }).then(() => renderPost());
}
async function renderPost() {
  let res = await fetch(`${API}?q=${searchText}&_page=${page}&_limit=5`);
  let postData = await res.json();
  $(".inp_post").val("");
  $(".posts_list").html("");
  getPagination();
  postData.forEach((item) => {
    $(".posts_list").append(`
                <div class="div_content"  style="list-style-type:none; margin-bottom:0px;font-size:25px;height:100px; border:2px solid blue; border-radius:20px; background-color: white ;">${item.content}</div>  
                <button id=${item.id} class="btn-delete" style="height:25px;margin-bottom:20px;border-radius: 5px; background-color: rgb(59, 59, 255); color: white">Удалить</button>
                <button id=${item.id} class="btn-edit" style="height:25px;border-radius: 5px; background-color: rgb(59, 59, 255); color: white">Редактировать</button>
                 
            `);
  });
};
$("body").on("click", ".btn-delete", function (event) {
  let id = event.target.id;
  fetch(`http://localhost:7000/posts/${id}`, {
    method: "DELETE",
  }).then((res) => renderPost());
});
renderPost();
$("body").on("click", ".btn-edit", function (e) {
  editedId = e.target.id;
  fetch(`http://localhost:7000/posts/${editedId}/`)
    .then((res) => res.json())
    .then((postToEdit) => {
      $(".edit-inp").val(postToEdit.content);
      modal.css("display", "block");
    });
});
$(".my-str").on("click", function () {
  modal2.css("display", "block");
});
$(".open-btn").on("click", function () {
  modal3.css("display", "block");
});
$(".btn-save").on("click", function () {
  if ($(".edit-inp").val() == "") {
    alert("Заполните поле");
    $(".edit-inp").val("");
    return;
  }
  let editedPost = {
    content: $(".edit-inp").val(),
  };
  fetch(`http://localhost:7000/posts/${editedId}`, {
    method: "PUT",
    body: JSON.stringify(editedPost),
    headers: {
      "Content-Type": "application/json; charset = utf-8",
    },
  }).then(() => {
    renderPost();
    modal.css("display", "none");
  });
});
span.on("click", function () {
  modal.css("display", "none");
});
span.on("click", function () {
  modal2.css("display", "none");
});
span.on("click", function () {
  modal3.css("display", "none");
});
getPagination();
function getPagination() {
  fetch(`http://localhost:7000/posts?q=${searchText}`)
    .then((res) => res.json())
    .then((data) => {
      pageCount = Math.ceil(data.length / 5);
      $(".pagination-page").remove();
      for (let i = pageCount; i >= 1; i--) {
        $(".previous-btn").after(`
            <span class="pagination-page">
            <a href="#">${i}</a>
            </span>
            `);
      }
    });
}
$(".search-inp").on("keyup", function (e) {
  searchText = e.target.value;
  renderPost();
});
$(".next-btn").on("click", function () {
  if (page >= pageCount) return;
  page++;
  renderPost();
});
$(".previous-btn").on("click", function () {
  if (page <= 1) return;
  page--;
  renderPost();
});
$("body").on("click", ".pagination-page", function (e) {
  console.log(e.target);
  page = e.target.innerText;
  renderPost();
});

$(".loupe").on("click", function () {
  $(".search-inp").css("display", "block");
  $(".loupe").css("display", "none");
});
