const todoInput = document.querySelector('.todo-input')
const addTodoBtn = document.querySelector('.add-todo-btn')
const filters = document.querySelectorAll('.filters button')
const deleteAllBtn = document.querySelector('.delete-all-btn')
const todoList = document.querySelector('.todo-list')

let todos = []
let editId;
let isTodoEditable = false

if(localStorage.getItem('todos') !== null) {
    todos = JSON.parse(localStorage.getItem('todos'))
}


filters.forEach(filterBtn => {
    filterBtn.addEventListener('click', function(){
        document.querySelector('button.active').classList.remove('active')
        filterBtn.classList.add('active')
        displayTodos(filterBtn.id)
    })
})



addTodoBtn.addEventListener('click', addTodo)
deleteAllBtn.addEventListener('click', deleteAll)



function addTodo(e) {
    e.preventDefault()
    
    if(todoInput.value == "") {
        alert('Do not leave the input blank.')
    }else {
        if(!isTodoEditable) {
            todos.push({"id": todos.length + 1, "title": todoInput.value, "status": "pending"})     //!create
        }else{
            todos.forEach(todo => {
                if(todo.id == editId) {
                    todo.title = todoInput.value
                }
                isTodoEditable = false
            })
            //!edit
        }
        todoInput.value = ""
        displayTodos(document.querySelector('button.active').id)
        localStorage.setItem('todos', JSON.stringify(todos))
    }
}

function displayTodos(filter) {
    let result = ""

    if(todos.length === 0) {
        todoList.innerHTML = "<li class='empty-list-warning'>Empty List</li>"
    }else {
        todos.forEach(todo => {

            let completed = todo.status == "completed" ? "checked" : ""
            
            if(filter == todo.status || filter == "all") {
                result += `
                    <li class="todo-item">
                        <div class="todo-input-wrapper">
                            <input onclick='changeStatus(this)' type="checkbox" id="${todo.id}" class="todo-check" ${completed}>
                            <label for="${todo.id}" class="todo-label ${completed}">${todo.title}</label>
                        </div>
                        <div class="todo-options">
                            <button onclick='editTodo(${todo.id}, "${todo.title}")'><i class="fa-solid fa-pen"></i></button>
                            <button onclick='deleteTodo(${todo.id})'><i class="fa-solid fa-trash"></i></button>
                        </div>
                    </li>
                `
            }

        })

        todoList.innerHTML = result
    }
}


function changeStatus(selectedCheckbox) {
    let status;
    let label = selectedCheckbox.nextElementSibling
    
    if(selectedCheckbox.checked) {
        label.classList.add('checked')
        status = "completed"
    }else {
        label.classList.remove('checked')
        status = "pending"
    }

    for(let todo of todos) {
        if(todo.id == selectedCheckbox.id) {
            todo.status = status
        }
    }

    displayTodos(document.querySelector('button.active').id)
    localStorage.setItem('todos', JSON.stringify(todos))

}

function editTodo(todoId, todoTitle) {
    isTodoEditable = true
    editId = todoId
    todoInput.value = todoTitle
    todoInput.focus()
    localStorage.setItem('todos', JSON.stringify(todos))
}

function deleteTodo(id) {
    let deletedId;

    for(let index in todos) {
        if(todos[index].id == id) {
            deletedId = index
        }
    }

    todos.splice(deletedId, 1)
    displayTodos(document.querySelector('button.active').id)
    localStorage.setItem('todos', JSON.stringify(todos))
}


function deleteAll() {
    todos.splice(0, todos.length)
    displayTodos()
    localStorage.setItem('todos', JSON.stringify(todos))
}


displayTodos(document.querySelector('button.active').id)