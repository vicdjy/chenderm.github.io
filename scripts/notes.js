//When the page first loads.
$(document).ready( function() {
    console.log("Ready!");
    var ctx = document.getElementById("notestext");
    var txta = sessionStorage.getItem("notesarea");
    document.getElementById("notestext").innerHTML = txta;
    
});

function printNotes(){
    window.print();
}
