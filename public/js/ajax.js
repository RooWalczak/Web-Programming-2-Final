//API - URL endpoint
let url = "http://localhost:8900/api/";
let books = [];

//Proccess AJAX Calls
function processAJAX(type='GET',id='',data=null){
    //create AJAX call
    if(type=='GET' || type=='DELETE'){
        data = null
    }else{
        data = JSON.stringify(data);
    };

    //Getting value from radio button
    let ajaxType = $("#ajax-type input:checked").val();

    if(ajaxType == 'ajax'){
        console.log('XMLHTTPREQUEST');

        var xhr = new XMLHttpRequest();
        xhr.open(type,url + id);
        xhr.setRequestHeader('Content-type','application/json','char-set=utf-8');
        xhr.send(data);
        xhr.onreadystatechange = ()=>{
            if(xhr.readyState == 4 && xhr.status == 200){
                //convert data to JS object
                books = JSON.parse(xhr.responseText);
                processResult(books, type);
            };
        };
        xhr.error = ()=>{
            $("#result").html("Error! Could not load data.");
        };
    }else{
        //jQuery
        console.log('JQUERY AJAX');

        $.ajax({
            method:type,
            url: url + id,
            data: data,
            async: true,
        })
        .done((data)=>{
            books = data;
            processResult(books, type);
        })
        .fail((data)=>{
            $("#result").html("Error! Could not load data.");
        })
    };

    
};

$().ready(()=>{

    //GET button
    $("#btnGet").click(()=>{
        $("#ajaxForm").show();
        $("#result").hide();
        $("#ajaxForm").html(getDeleteForm('get'));
        $("#formGetDelete").submit(()=>{
            //get id from form
            let id = $("#formGetDelete #id").val();
            processAJAX('GET',id,'');
        })
    })
    //Delete button
    $("#btnDelete").click(()=>{
        $("#ajaxForm").show();
        $("#result").hide();
        $("#ajaxForm").html(getDeleteForm('delete'));
        $("#formGetDelete").submit(()=>{
            //get id from form
            let id = $("#formGetDelete #id").val();
            processAJAX('DELETE',id,'');
        })
    })
    //POST button
    $("#btnPost").click(()=>{
        $("#ajaxForm").show();
        $("#result").hide();
        $("#ajaxForm").html(postPutForm('post'));
        $("#gopost").click(()=>{
            let book = buildBookObject();
            processAJAX('POST','',book);
        });
    });
    //PUT button
    $("#btnPut").click(()=>{
        $("#result").hide();
        processAJAX('GET');
    });
});

function getDeleteForm(type){
    message = "Fetch Books";
    if(type=='delete'){
        message = "Delete Books";
    }
    return(
        `
            <h1>${message}</h1>
            <form id="formGetDelete" onsubmit="return false">
                <div class="formControls">
                    <label for="id">ID:</label>
                    <input name="id" id="id">
                    <p>(Leave blank for all records)</p>
                </div>
                <div class="formControls">
                    <button id="go${type.toLowerCase()}">GO!</button>
                </div>
            </form>
        `
    );
};

function postPutForm(type){
    message = "Insert A New Book";
    disabled = "";
    if(type=='put'){
        message = "Update A Book";
        disabled = "disabled";
    }
    return(
        `
        <h1>${message}</h1>
        <form id="formPutPost" onsubmit="return false">
            <div class="formControls">
                <label for="id">ID:</label>
                <input name="id" id="id" ${disabled}>
            </div>
            <div class="formControls">
                <label for="title">Title:</label>
                <input name="title" id="title">
            </div>
            <div class="formControls">
                <label for="author">Author:</label>
                <input name="author" id="author">
            </div>
            <div class="formControls">
                <label for="publisher">Publisher:</label>
                <input name="publisher" id="publisher">
            </div>
            <div class="formControls">
                <label for="year">Year:</label>
                <input name="year" id="year">
            </div>
            <div class="formControls">
                <button id="go${type.toLowerCase()}">GO!</button>
            </div>
        </form>
        `
    );
};

//Build book table
function bookTable(books){

    str = `
    <h1>Books</h1>
    <table class="tableBooks" cellpadding="8px" cellspacing="0px">
        <thead>
            <tr>
                <th>Id</th>
                <th>Title</th>
                <th>Author</th>
                <th>Publisher</th>
                <th>Year</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>`;

    //works for ARRAY only
    books.forEach(book => {
        str += 
        `
        <tr>
            <td>${book.id}</td>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.publisher}</td>
            <td>${book.year}</td>
            <td>
                <button onclick="prepareUpdate(${book.id})">Edit</button>
                <button onclick="prepareDelete(${book.id})">Delete</button>
            </td>
        </tr>
        `
    });
            
    str += `</tbody></table>`;
    return str;
};

//Process Result
function processResult(books,method){
    $("#ajaxForm").hide();
    $("#result").show();
    switch(method){
        case 'GET':
            $("#result").html(bookTable(books));
            break;
        case 'PUT':
            $("#result").html(books);
            break;
        case 'POST':
            $("#result").html(books);
            break;
        case 'DELETE':
            $("#result").html(books);
            break;
    }
}

//Prepare Delete
function prepareDelete(id){
    processAJAX('DELETE',id,'');
}

//Prepare Update
function prepareUpdate(id){
    $("#ajaxForm").html(postPutForm('put'));
    $("#ajaxForm").show();
    $("#result").hide();

    let index = books.findIndex(book => book.id==id);
    if(index != -1){
        let book = books[index];

        //Prefill Form
        $("#formPutPost #id").val(book.id);
        $("#formPutPost #title").val(book.title);
        $("#formPutPost #author").val(book.author);
        $("#formPutPost #publisher").val(book.publisher);
        $("#formPutPost #year").val(book.year);
    };
    $("#goput").click(()=>{
        let newBook = buildBookObject();
        processAJAX('PUT',newBook.id,newBook);
    });
};

//Build book object
function buildBookObject(){
    return {
        "id":$("#formPutPost #id").val(),
        "title":$("#formPutPost #title").val(),
        "author":$("#formPutPost #author").val(),
        "publisher":$("#formPutPost #publisher").val(),
        "year":$("#formPutPost #year").val(),
    };
};