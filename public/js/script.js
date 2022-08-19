const userid = document.getElementById("userIdStore")
const delbtn = document.getElementById("del-btn")
const delTxt = document.getElementById("midI")
const genre = document.getElementById("genrecontainer")

function openNav() {
    document.getElementById("mySidenav").style.width = "200px";
  }
  
  function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("genrelist").style.display = "none"
  }

  delbtn.addEventListener("click", removeMovie)

  genre.addEventListener("click", () => {
    document.getElementById("genrelist").style.display = "block"
  })

$(".th1").on("click", function(){
  let column = $(this).data("column")
  let order = $(this).data("order")
  let header = $(this).html()
  
  header = header.substring(0, header.length -1)

  if(order === "desc"){
    $(this).data("order", "asc")
    myArray = myArray.sort((a,b) => a[column] > b[column] ? 1 : -1)
    header += "&#9660"
  } else {
    $(this).data("order", "desc")
    myArray = myArray.sort((a,b) => a[column] < b[column] ? 1 : -1)
    header += "&#9650"
  }
  $(this).html(header)
  buildMyTable(myArray)
})

$(".th2").on("click", function(){
  
  let column = $(this).data("column")
  let order = $(this).data("order")
  let header = $(this).html()
  header = header.substring(0, header.length -1)

  if(order === "desc"){
    $(this).data("order", "asc")
    myArray2 = myArray2.sort((a,b) => a[column] > b[column] ? 1 : -1)
    header += "&#9660"
  } else {
    $(this).data("order", "desc")
    myArray2 = myArray2.sort((a,b) => a[column] < b[column] ? 1 : -1)
    header += "&#9650"
  }
  $(this).html(header)
  buildAllTable(myArray2)
})


  let myArray = []
  let myArray2 = []


//get all my movies
  $.ajax({
    method: "GET",
    url: `/myMovies?usid=${userid.value}`,
    success: function(res){
      myArray = res
      buildMyTable(myArray)
    }
  })


  function buildMyTable(data) {
    
    let table = document.getElementById('myTable')
    table.innerHTML = "";
    for (let i = 0; i < data.length; i++) {
      let row = `<tr>
                    <td>${data[i].id}</td>
                    <td>${data[i].title}</td>
                    <td>${data[i].genre}</td>
                    <td>${data[i].year}</td>
                    <td>${data[i].watched_movies.rating}</td>
                    <td><a href="#" class="tableA" onclick="myMovieRemove(${data[i].id},${userid.value})">Remove from watched</a></td>
                  </tr>`
                  table.innerHTML += row
    }
  }


  //get all movies

  $.ajax({
    method: "GET",
    url: `/movies`,
    success: function(res){
      myArray2 = res
      buildAllTable(myArray2)
    }
  })

  function buildAllTable(data) {
     
    let table = document.getElementById('allTable')
    table.innerHTML = "";
    for (let i = 0; i < data.length; i++) {

      let ratingboxid = "ratingbox" + i
      let row = `<tr>
                    <td>${data[i].id}</td>
                    <td>${data[i].title}</td>
                    <td>${data[i].genre}</td>
                    <td>${data[i].year}</td>
                    <td><select name="rating" id="ratingbox${[i]}">
                    <option value="" selected></option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </select></td>
                    <td><a href="#" class="tableA" onclick="myMovieAdd(${data[i].id},${userid.value}, getRating('${ratingboxid}'))">Add to watched</a></td>
                  </tr>`
                  table.innerHTML += row
                
    }
  }

  function getRating(rating){
    if (!document.getElementById(rating).value) {
      alert("You need to add a rating first!")
    }
    return document.getElementById(rating).value
  }



  async function myMovieRemove(mid, usid) {
  await fetch("/myMovies" + `/?mid=${mid}&usid=${usid}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(res => console.log(res))
  window.location.reload();
    }

    async function myMovieAdd(mid, usid, rating) {
      await fetch("/myMovies", {
        method: 'PUT',
        body: JSON.stringify({mid: mid, usid: usid, rating: rating}),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(res => console.log(res))
      window.location.reload();
        }

        async function removeMovie() {
        
          await fetch("/movies/" + delTxt.value, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            }
          })
          .then(res => console.log(res))
          window.location.reload();
          return
            }

            async function logout() {
        
              await fetch("/logout", {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json'
                }
              })
              .then(res => console.log(res))
                }
