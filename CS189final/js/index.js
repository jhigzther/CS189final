var box1 = document.getElementById("articlecontent1");
var box2 = document.getElementById("articlecontent2");
var box4 = document.getElementById("gbox1")
var box5 = document.getElementById("gbox2")
var box6 = document.getElementById("gbox3")
var box7 = document.getElementById("gbox4")
var box8 = document.getElementById("gbox5")
var box9 = document.getElementById("gbox6")

function ajax(url) {
  return new Promise((resolve, reject) => {
    let request = new XMLHttpRequest();
    request.open("GET", url);
    request.onload = function() {
      try {
        if(this.status === 200 ){
          resolve(JSON.parse(this.responseText));
        } 
      else {
        reject(this.status + " " + this.statusText);
      }
      } 
      catch(error) {
      reject(error.message);
      }
  };  
  request.onerror = function() {
    reject(this.status + " " + this.statusText);
  };
    request.send();
  });
}

var promiselist = [];
var user = ajax("https://jsonplaceholder.typicode.com/users");
promiselist.push(user);
for(let i = 0; i < 10; i++) {
  id = i + 1;
	var q = ajax("https://jsonplaceholder.typicode.com/posts?userId=" + id);
	promiselist.push(q);
}

Promise.all(promiselist).then(
 function(p){
    var output = "";
    var output2 = "";
    var output3 = "";
    var output4 = "";
   var output5 = "";
   var output6 = "";
   var output7 = "";
   var output8 = "";
   var output9 = "";
   
   
  for(let i = 0; i < 1; i++)
  {
    output += "<div class='item'>"
    posts = p[i+1];
    for(post=0; post < 1; post++){
      output += "<h2><a href='post1.html'>" + posts[post].title + "</a></h2>"
    }
    
    output += "<h4> written by: "  + "<a href='contact1.html'>" + p[0][i].name + "</a></h4>"
    
    for(post=0; post < 1; post++){
      output += "<p>" + posts[post].body + "</p>"
    }
    output += "</div>"
  }
   
   
   for(let i = 1; i < 2; i++)
  {
    output2 += "<div class='item'>"
    posts = p[i+1];
    for(post=0; post < 1; post++){
      output2 += "<h2><a href='post2.html'>" + posts[post].title + "</a></h2>"
    }
    
    output2 += "<h4>written by: " + "<a href='contact2.html'>" + p[0][i].name + "</a></h4>"
    
    for(post=0; post < 1; post++){
      output2 += "<p>" + posts[post].body + "</p>"
    }
    output2 += "</div>"
  }
   
   
   
   
   for(let i = 2; i < 3; i++)
  {
    output3 += "<div class='name'><h3><a href='contact3.html'>"  + p[0][i].name + "</a></h3>"
    
    posts = p[i+1];
    for(post=0; post < 1; post++){
      output3 += "<p><a href='post3.html'>" + posts[post].title + "</a></p>"
    }
    
    output3 += "</div>"
  }
   
   
   
   for(let i = 3; i < 4; i++)
  {  
    posts = p[i+1];
    for(post=0; post < 1; post++){
      output4 += "<p><a href='post3.html'>" + posts[post].title + "</a></p>"
    }
  }
   
   for(let i = 4; i < 5; i++)
  {  
    posts = p[i+1];
    for(post=0; post < 1; post++){
      output5 += "<p><a href='post3.html'>" + posts[post].title + "</a></p>"
    }
  }
   
   for(let i = 5; i < 6; i++)
  {  
    posts = p[i+1];
    for(post=0; post < 1; post++){
      output6 += "<p><a href='post3.html'>" + posts[post].title + "</a></p>"
    }
  }
   
   for(let i = 6; i < 7; i++)
  {  
    posts = p[i+1];
    for(post=0; post < 1; post++){
      output7 += "<p><a href='post3.html'>" + posts[post].title + "</a></p>"
    }
  }
   
   for(let i = 8; i < 9; i++)
  {  
    posts = p[i+1];
    for(post=0; post < 1; post++){
      output8 += "<p><a href='post3.html'>" + posts[post].title + "</a></p>"
    }
  }
   
   for(let i = 9; i < 10; i++)
  {  
    posts = p[i+1];
    for(post=0; post < 1; post++){
      output9 += "<p><a href='post3.html'>" + posts[post].title + "</a></p>"
    }
  }
   
   
   
   
   
   
   
   
   
  box1.insertAdjacentHTML('beforeend', output);
   box2.insertAdjacentHTML('beforeend', output2);
   box4.insertAdjacentHTML('beforeend', output4);
   box5.insertAdjacentHTML('beforeend', output5);
   box6.insertAdjacentHTML('beforeend', output6);
   box7.insertAdjacentHTML('beforeend', output7);
   box8.insertAdjacentHTML('beforeend', output8);
   box9.insertAdjacentHTML('beforeend', output9);
 }
  
  
  
  
  
);