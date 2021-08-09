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
        document.getElementById("save_note").innerHTML += 
        `<div class="save_content_note" id="${id}" onclick="openModel(${id})">
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
    if(document.getElementsByClassName('note_take_title')[0].value.length==0 || document.getElementById('noteText').value.length==0){
        if(document.getElementsByClassName('note_take_title')[0].value.length==0){
            var title = "Give a Title";
            var note = document.getElementById('noteText').value;
            var noteData={
                id:noteCount,
                title: title,
                note: note,
            }

            db.collection('notes').add(noteData);
            closeinput();
            location.reload();
        }else if(document.getElementById('noteText').value.length==0){
            var title = document.getElementsByClassName('note_take_title')[0].value;
            var note = "Take a note";
            var noteData={
                id:noteCount,
                title: title,
                note: note,
            }

            db.collection('notes').add(noteData);
            closeinput();
            location.reload();
        }
    }
    if(document.getElementsByClassName('note_take_title')[0].value.length!=0 && document.getElementById('noteText').value.length!=0){
        var title = document.getElementsByClassName('note_take_title')[0].value;
        var note = document.getElementById('noteText').value;
        var noteData={
            id:noteCount,
            title: title,
            note: note,
        }

        db.collection('notes').add(noteData);
        closeinput();
        location.reload();
    }
}
function openModel(X){
    var x = parseInt(X);
    db.collection('notes').get().then(notes => {
        document.getElementsByClassName("note_update_title")[0].value = notes[x]['title'];
        document.getElementsByClassName('note_update')[0].value = notes[x]['note'];
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
    //console.log(title);
    //console.log(note);
    db.collection('notes').doc({ id: x }).update({
        title:title,
        note:note
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
                    var snote = `<div class="save_content_note" id="${id}" onclick="openModel(${id})">
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
                    db.collection('pagemode').doc({ id: 1 }).update({mode:"1"});
                    document.getElementsByClassName('link')[0].innerHTML = `<i class="fas fa-moon mode" onclick="changemode()"></i>`;
                }
                if(pagemode[i].mode == "1"){
                    db.collection('pagemode').doc({ id: 1 }).update({mode:"0"});
                    document.getElementsByClassName('link')[0].innerHTML = `<i class="fas fa-moon mode" onclick="changemode()"></i>`;
                }
            }
            //console.log("mode1")
        }
    });
    location.reload();
}