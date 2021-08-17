let db = new Localbase('db');
var noteCount;
db.collection('notes').get().then(notes => {
    //console.log(parseInt(notes.length));
    if(parseInt(notes.length)==parseInt(0)){
        noteCount = 0;
    }else{
        //console.log(notes[notes.length-1]['id']+1);
        noteCount = parseInt(notes[notes.length-1]['id']+1);
    }
});
//console.log(noteCount);
function newinput() {
    document.getElementById("note").style.display = "none";
    document.getElementById("note_take").style.display = "flex";
}
function closeinput() {
    document.getElementById("note").style.display = "flex";
    document.getElementById("note_take").style.display = "none";
    document.getElementsByClassName('note_take_title')[0].value = "";
    document.getElementById('noteText').value = "";
}
db.collection('notes').get().then(notes => {
    for(var i=0;i<notes.length;i++){
        //console.log(notes[i]['id']);
        var id = notes[i]['id'];
        var title = notes[i]['title'];
        var note = notes[i]['note'];
        var color = notes[i]['color'];
        document.getElementById("save_note").innerHTML += 
        `<div class="save_content_note" id="${id}" onclick="openModel(${id})" style="background:${color}">
            <div class="note_take_title"><p style='overflow:auto;cursor:context-menu;'>${title}</p></div>
            <div style="width: 100%; padding: 1rem;border-radius: 5px;outline: none;border: none;resize: none;" class="noteText" ><p style='overflow:auto;cursor:context-menu;'>${note}</p></div>
            <div class="dltbutton">
                <i class="fas fa-trash" onclick="deletenote(${id})"></i>
            </div>
        </div>`;
    }
})
function deletenote(x){
    db.collection('notes').doc({ id: x }).delete();
    location.reload();
}
function save() {
    var title,note,color;
    color = document.getElementsByClassName("content_note")[0].style.background;
    if(document.getElementsByClassName('note_take_title')[0].value.length!=0 && document.getElementById('noteText').value.length!=0){
        var title = document.getElementsByClassName('note_take_title')[0].value;
        var note = document.getElementById('noteText').value;
    }
    if(document.getElementById('noteText').value.length==0){
        title = document.getElementsByClassName('note_take_title')[0].value;
        note = "Take a note";
    }
    else if(document.getElementsByClassName('note_take_title')[0].value.length==0){
        var title = "Give a Title";
        note = document.getElementById('noteText').value;
    }else{
        title = document.getElementsByClassName('note_take_title')[0].value;
        note = document.getElementById('noteText').value;
    }
    var noteData={
        id:noteCount,
        title: title,
        note: note,
        color:color,
    }

    db.collection('notes').add(noteData);
    closeinput();
    location.reload();
}
function openModel(X){
    var x = parseInt(X);
    console.log(x);
    db.collection('notes').doc({ id: x }).get().then(notes => {
        document.getElementsByClassName("note_update_title")[0].value = notes.title;
        document.getElementsByClassName("update_content_note")[0].style.background = notes.color;
        document.getElementsByClassName('note_update')[0].value = notes.note;
        document.getElementsByClassName('update_delete')[0].id = x;
        document.getElementsByClassName('update_data')[0].id = x;
    });
    $(".mask").addClass("active");
}
function closeModel(){
    $(".mask").removeClass("active");
}
function updatenotes(x){
    var title = document.getElementsByClassName("note_update_title")[0].value;
    var note = document.getElementsByClassName('note_update')[0].value;
    var color = document.getElementsByClassName("update_content_note")[0].style.background;
    //console.log(title);
    //console.log(note);
    db.collection('notes').doc({ id: x }).update({
        title:title,
        note:note,
        color:color,
    });
    location.reload();
}
var input = document.getElementById("search_note");
input.addEventListener("keyup", function(event) {
    searchnotes(input);
});
function searchnotes(input){
    //console.log(input.value);
    db.collection('notes').get().then(notes => {
        var searchitem = ``;
        document.getElementById("save_note").innerHTML=``;
        if(notes.length>0){
            for(let i = 0;i<notes.length;i++){
                var searchtitle  = notes[i].title.toLowerCase();
                var searchnote = notes[i].note.toLowerCase();
                if(searchtitle.includes(input.value.toLowerCase()) || searchnote.includes(input.value.toLowerCase())){
                    //console.log(notes[i].title);
                    var id = notes[i]['id'];
                    var title = notes[i]['title'];
                    var note = notes[i]['note'];
                    var color = notes[i]['color'];
                    var snote = `<div class="save_content_note" id="${id}" onclick="openModel(${id})" style="background:${color}">
                        <div class="note_take_title"><p style='overflow:auto;cursor:context-menu;'>${title}</p></div>
                        <div style="width: 100%; padding: 1rem;border-radius: 5px;outline: none;border: none;resize: none;" class="noteText" ><p style='overflow:auto;cursor:context-menu;'>${note}</p></div>
                        <div class="dltbutton">
                            <i class="fas fa-trash" onclick="deletenote(${id})"></i>
                            </div>
                            </div>`;
                            searchitem=searchitem+snote;
                        }
                        
                    }
                }
        if(searchitem.length>0){
            document.getElementById("save_note").innerHTML = searchitem;
            setColor();
        }else{
            if(input.value == 0){
                location.reload();
            }else{
                document.getElementById("save_note").innerHTML = `<h1>No notes found</h1>`;
            }
        }
        
    });
}
//db.collection('notes').add(noteData);
setColor();
function setColor(){
    db.collection('pagemode').doc('pagemode').get().then(pagemode => {
        neg=pagemode.mode;
        if(neg == "1"){
            document.body.style.backgroundColor = "#202124";
            $(".fa-moon").addClass("darkmoon");
            $(".fa-palette").addClass("darkmoon");
            $(".dropcolor").addClass("dropback");
            $(".note_input").addClass("darknote_input");
            document.querySelector('.note_input h3').style.color="#e8eaed";
            $(".content_note").addClass("darkcontent_note");
            $('.content_note input').addClass('darkcontent_note_input');
            $('.content_note textarea').addClass('darkcontent_note_textarea');
            document.getElementsByClassName('button')[0].style.background="transparent";
            db.collection('notes').get().then(notes => {
                for(let i = 0;i<notes.length;i++){
                    var id = "#"+i;
                    $(id).addClass('darksave_content_note');
                    $('.note_take_title').addClass('darknote_take_title');
                    $('.noteText').addClass('darknote_take_title');
                    $('.dltbutton').addClass('darknote_take_title');
                    $('.Model').addClass('darkmodel');
                    $('.close').addClass('darkclose');
                    $('.update_content_note').addClass('darknoteText');
                    $('.update_content_note').addClass('darknote_input');
                    $('.note_update_title').addClass('darknoteText');
                    $('.note_update').addClass('darknoteText');
                }
            });
        }
        else{
            document.body.style.backgroundColor = "white";
            $(".fa-moon").removeClass("darkmoon");
            $(".fa-palette").removeClass("darkmoon");
            $(".dropcolor").removeClass("dropback");
        }
    })
}
function changemode(){
    db.collection('pagemode').get().then(pagemode => {
        if(pagemode.length==0){
            var x = "0"
            db.collection('pagemode').add({id:1,mode:x}, 'pagemode')
        }else{
            //console.log(pagemode[1].mode)
            for(let i =0;i<pagemode.length;i++){
                if(pagemode[i].mode == "0"){
                    changecolblock("1");
                    db.collection('pagemode').doc({ id: 1 }).update({mode:"1"});
                    document.getElementsByClassName('link')[0].innerHTML = `<i class="fas fa-moon mode" onclick="changemode()"></i>`;
                }
                if(pagemode[i].mode == "1"){
                    changecolblock("0");
                    db.collection('pagemode').doc({ id: 1 }).update({mode:"0"});
                    document.getElementsByClassName('link')[0].innerHTML = `<i class="fas fa-moon mode" onclick="changemode()"></i>`;
                }
            }
            //console.log("mode1")
        }
    });
    location.reload();
}
const dragArea = document.querySelector("#save_note");
new Sortable(dragArea,{
    animation:350,
});
function pickcolor(x){
    console.log(x);
    db.collection('pagemode').doc('pagemode').get().then(pagemode => {
        neg=pagemode.mode;
        var color;
        if(neg == "1"){
            if(x=="default"){
                color =  "transparent"
                document.getElementsByClassName("content_note")[0].style.background =color;
            }
            if(x=="redcolor"){
                color =  "#5c2b29"
                document.getElementsByClassName("content_note")[0].style.background = "#5c2b29";
            }
            if(x=="orangecolor"){
                color = "#614a19"
                document.getElementsByClassName("content_note")[0].style.background = "#614a19";
            }
            if(x=="yellowcolor"){
                color = "#635d19"
                document.getElementsByClassName("content_note")[0].style.background = "#635d19";
            }
            if(x=="greencolor"){
                color = "#345920";
                document.getElementsByClassName("content_note")[0].style.background = "#345920";
            }
            if(x=="tealcolor"){
                color = "#16504b";
                document.getElementsByClassName("content_note")[0].style.background = "#16504b";
            }
            if(x=="bluecolor"){
                color = "#2d555e";
                document.getElementsByClassName("content_note")[0].style.background = "#2d555e";
            }
            if(x=="darkbluecolor"){
                color = "#1e3a5f";
                document.getElementsByClassName("content_note")[0].style.background = "#1e3a5f";
            }
            if(x=="purplecolor"){
                color = "#42275e";
                document.getElementsByClassName("content_note")[0].style.background = "#42275e";
            }
            if(x=="pinkcolor"){
                color = "#5b2245";
                document.getElementsByClassName("content_note")[0].style.background = "#5b2245";
            }
            if(x=="browncolor"){
                color = "#442f19";
                document.getElementsByClassName("content_note")[0].style.background = "#442f19";
            }
            if(x=="greycolor"){
                color = "#3c3f43";
                document.getElementsByClassName("content_note")[0].style.background = "#3c3f43";
            }
        }else{
            if(x=="default"){
                color =  "transparent"
                document.getElementsByClassName("content_note")[0].style.background =color;
            }
            if(x=="redcolor"){
                color = "#f28b82";
                document.getElementsByClassName("content_note")[0].style.background = "#f28b82";
            }
            if(x=="orangecolor"){
                color = "#fbbc04";
                document.getElementsByClassName("content_note")[0].style.background = "#fbbc04";
            }
            if(x=="yellowcolor"){
                color = "#fff475";
                document.getElementsByClassName("content_note")[0].style.background = "#fff475";
            }
            if(x=="greencolor"){
                color = "#ccff90";
                document.getElementsByClassName("content_note")[0].style.background = "#ccff90";
            }
            if(x=="tealcolor"){
                color = "#a7ffeb";
                document.getElementsByClassName("content_note")[0].style.background = "#a7ffeb";
            }
            if(x=="bluecolor"){
                color =  "#cbf0f8";
                document.getElementsByClassName("content_note")[0].style.background = "#cbf0f8";
            }
            if(x=="darkbluecolor"){
                color = "#aecbfa";
                document.getElementsByClassName("content_note")[0].style.background = "#aecbfa";
            }
            if(x=="purplecolor"){
                color =  "#d7aefb";
                document.getElementsByClassName("content_note")[0].style.background = "#d7aefb";
            }
            if(x=="pinkcolor"){
                color = "#fdcfe8";
                document.getElementsByClassName("content_note")[0].style.background = "#fdcfe8";
            }
            if(x=="browncolor"){
                color =  "#fdcfe8";
                document.getElementsByClassName("content_note")[0].style.background = "#e6c9a8";
            }
            if(x=="greycolor"){
                color = "#e8eaed";
                document.getElementsByClassName("content_note")[0].style.background = "#e8eaed";
            }
        }

    });
}
function pickupdatecolor(x){
    console.log(x);
    db.collection('pagemode').doc('pagemode').get().then(pagemode => {
        neg=pagemode.mode;
        var color;
        if(neg == "1"){
            if(x=="default"){
                color =  "transparent"
                document.getElementsByClassName("update_content_note")[0].style.background ="transparent";
            }
            if(x=="redcolor"){
                color =  "#5c2b29"
                document.getElementsByClassName("update_content_note")[0].style.background = "#5c2b29";
            }
            if(x=="orangecolor"){
                color = "#614a19"
                document.getElementsByClassName("update_content_note")[0].style.background = "#614a19";
            }
            if(x=="yellowcolor"){
                color = "#635d19"
                document.getElementsByClassName("update_content_note")[0].style.background = "#635d19";
            }
            if(x=="greencolor"){
                color = "#345920";
                document.getElementsByClassName("update_content_note")[0].style.background = "#345920";
            }
            if(x=="tealcolor"){
                color = "#16504b";
                document.getElementsByClassName("update_content_note")[0].style.background = "#16504b";
            }
            if(x=="bluecolor"){
                color = "#2d555e";
                document.getElementsByClassName("update_content_note")[0].style.background = "#2d555e";
            }
            if(x=="darkbluecolor"){
                color = "#1e3a5f";
                document.getElementsByClassName("update_content_note")[0].style.background = "#1e3a5f";
            }
            if(x=="purplecolor"){
                color = "#42275e";
                document.getElementsByClassName("update_content_note")[0].style.background = "#42275e";
            }
            if(x=="pinkcolor"){
                color = "#5b2245";
                document.getElementsByClassName("update_content_note")[0].style.background = "#5b2245";
            }
            if(x=="browncolor"){
                color = "#442f19";
                document.getElementsByClassName("update_content_note")[0].style.background = "#442f19";
            }
            if(x=="greycolor"){
                color = "#3c3f43";
                document.getElementsByClassName("update_content_note")[0].style.background = "#3c3f43";
            }
        }else{
            if(x=="default"){
                color =  "transparent"
                document.getElementsByClassName("update_content_note")[0].style.background ="transparent";
            }
            if(x=="redcolor"){
                color = "#f28b82";
                document.getElementsByClassName("update_content_note")[0].style.background = "#f28b82";
            }
            if(x=="orangecolor"){
                color = "#fbbc04";
                document.getElementsByClassName("update_content_note")[0].style.background = "#fbbc04";
            }
            if(x=="yellowcolor"){
                color = "#fff475";
                document.getElementsByClassName("update_content_note")[0].style.background = "#fff475";
            }
            if(x=="greencolor"){
                color = "#ccff90";
                document.getElementsByClassName("update_content_note")[0].style.background = "#ccff90";
            }
            if(x=="tealcolor"){
                color = "#a7ffeb";
                document.getElementsByClassName("update_content_note")[0].style.background = "#a7ffeb";
            }
            if(x=="bluecolor"){
                color =  "#cbf0f8";
                document.getElementsByClassName("update_content_note")[0].style.background = "#cbf0f8";
            }
            if(x=="darkbluecolor"){
                color = "#aecbfa";
                document.getElementsByClassName("update_content_note")[0].style.background = "#aecbfa";
            }
            if(x=="purplecolor"){
                color =  "#d7aefb";
                document.getElementsByClassName("update_content_note")[0].style.background = "#d7aefb";
            }
            if(x=="pinkcolor"){
                color = "#fdcfe8";
                document.getElementsByClassName("update_content_note")[0].style.background = "#fdcfe8";
            }
            if(x=="browncolor"){
                color =  "#fdcfe8";
                document.getElementsByClassName("update_content_note")[0].style.background = "#e6c9a8";
            }
            if(x=="greycolor"){
                color = "#e8eaed";
                document.getElementsByClassName("update_content_note")[0].style.background = "#e8eaed";
            }
        }
    });
}

function changecolblock(x){
    if(x=="1"){
        db.collection('notes').get().then(keeps => {
            for (let x =0;x<keeps.length;x++) {
                console.log(keeps[x].color);
                if(keeps[x].color == "rgb(242, 139, 130)"){
                    //console.log(keeps[x].color);
                    db.collection('notes').doc({ id: parseInt(x) }).update({color:"rgb(92, 43, 41)"});
                }
                if(keeps[x].color == "rgb(251, 188, 4)"){
                    //console.log(keeps[x].color);
                    db.collection('notes').doc({ id: parseInt(x) }).update({color:"rgb(97, 74, 25)"});
                }
                if(keeps[x].color == "rgb(255, 244, 117)"){
                    //console.log(keeps[x].color);
                    db.collection('notes').doc({ id: parseInt(x) }).update({color:"rgb(99, 93, 25)"});
                }
                if(keeps[x].color == "rgb(204, 255, 144)"){
                    //console.log(keeps[x].color);
                    db.collection('notes').doc({ id: parseInt(x) }).update({color:"rgb(52, 89, 32)"});
                }
                if(keeps[x].color == "rgb(167, 255, 235)"){
                    //console.log(keeps[x].color);
                    db.collection('notes').doc({ id: parseInt(x) }).update({color:"rgb(22, 80, 75)"});
                }
                if(keeps[x].color == "rgb(203, 240, 248)"){
                    //console.log(keeps[x].color);
                    db.collection('notes').doc({ id: parseInt(x) }).update({color:"rgb(45, 85, 94)"});
                }
                if(keeps[x].color == "rgb(174, 203, 250)"){
                    //console.log(keeps[x].color);
                    db.collection('notes').doc({ id: parseInt(x) }).update({color:"rgb(30, 58, 95)"});
                }
                if(keeps[x].color == "rgb(215, 174, 251)"){
                    //console.log(keeps[x].color);
                    db.collection('notes').doc({ id: parseInt(x) }).update({color:"rgb(66, 39, 94)"});
                }
                if(keeps[x].color == "rgb(253, 207, 232)"){
                    //console.log(keeps[x].color);
                    db.collection('notes').doc({ id: parseInt(x) }).update({color:"rgb(91, 34, 69)"});
                }
                if(keeps[x].color == "rgb(230, 201, 168)"){
                    //console.log(keeps[x].color);
                    db.collection('notes').doc({ id: parseInt(x) }).update({color:"rgb(68, 47, 25)"});
                }
                if(keeps[x].color == "rgb(232, 234, 237)"){
                    //console.log(keeps[x].color);
                    db.collection('notes').doc({ id: parseInt(x) }).update({color:"rgb(60, 63, 67)"});
                }
            }
        });
    }else{
        db.collection('notes').get().then(keeps => {
            for (let x =0;x<keeps.length;x++) {
                if(keeps[x].color == "rgb(92, 43, 41)"){
                    //console.log(keeps[x].color);
                    db.collection('notes').doc({ id: parseInt(x) }).update({color:"rgb(242, 139, 130)"});
                }
                if(keeps[x].color == "rgb(97, 74, 25)"){
                    //console.log(keeps[x].color);
                    db.collection('notes').doc({ id: parseInt(x) }).update({color:"rgb(251, 188, 4)"});
                }
                if(keeps[x].color == "rgb(99, 93, 25)"){
                    //console.log(keeps[x].color);
                    db.collection('notes').doc({ id: parseInt(x) }).update({color:"rgb(255, 244, 117)"});
                }
                if(keeps[x].color == "rgb(52, 89, 32)"){
                    //console.log(keeps[x].color);
                    db.collection('notes').doc({ id: parseInt(x) }).update({color:"rgb(204, 255, 144)"});
                }

                if(keeps[x].color == "rgb(22, 80, 75)"){
                    //console.log(keeps[x].color);
                    db.collection('notes').doc({ id: parseInt(x) }).update({color:"rgb(167, 255, 235)"});
                }
                if(keeps[x].color == "rgb(45, 85, 94)"){
                    //console.log(keeps[x].color);
                    db.collection('notes').doc({ id: parseInt(x) }).update({color:"rgb(203, 240, 248)"});
                }
                if(keeps[x].color == "rgb(30, 58, 95)"){
                    //console.log(keeps[x].color);
                    db.collection('notes').doc({ id: parseInt(x) }).update({color:"rgb(174, 203, 250)"});
                }
                if(keeps[x].color == "rgb(66, 39, 94)"){
                    //console.log(keeps[x].color);
                    db.collection('notes').doc({ id: parseInt(x) }).update({color:"rgb(215, 174, 251)"});
                }
                if(keeps[x].color == "rgb(91, 34, 69)"){
                    //console.log(keeps[x].color);
                    db.collection('notes').doc({ id: parseInt(x) }).update({color:"rgb(253, 207, 232)"});
                }
                if(keeps[x].color == "rgb(68, 47, 25)"){
                    //console.log(keeps[x].color);
                    db.collection('notes').doc({ id: parseInt(x) }).update({color:"rgb(230, 201, 168)"});
                }
                if(keeps[x].color == "rgb(60, 63, 67)"){
                    //console.log(keeps[x].color);
                    db.collection('notes').doc({ id: parseInt(x) }).update({color:"rgb(232, 234, 237)"});
                }
            }
        });
    }
}
