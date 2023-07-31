'use strict'

const openModal = () => document.getElementById('modal')
    .classList.add('active')

const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')
}


const getLocalStorage = () => JSON.parse(localStorage.getItem('db_aluno')) ?? []
const setLocalStorage = (dbaluno) => localStorage.setItem("db_aluno", JSON.stringify(dbaluno))

// CRUD - create read update delete
const deletealuno = (index) => {
    const dbaluno = readaluno()
    dbalunosplice(index, 1)
    setLocalStorage(dbaluno)
}

const updatealuno = (index, aluno) => {
    const dbaluno = readaluno()
    dbaluno[index] = aluno
    setLocalStorage(dbaluno)
}

const readaluno = () => getLocalStorage()

const createaluno = (aluno) => {
    const dbaluno = getLocalStorage()
    dbaluno.push (aluno)
    setLocalStorage(dbaluno)
}

const isValidFields = () => {
    return document.getElementById('form').reportValidity()
}

//Interação com o layout

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
    document.getElementById('nome').dataset.index = 'new'
}

const savealuno = () => {
    debugger
    if (isValidFields()) {
        const aluno = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            celular: document.getElementById('celular').value,
            cidade: document.getElementById('cidade').value
        }
        const index = document.getElementById('nome').dataset.index
        if (index == 'new') {
            createaluno(cliienent)
            updateTable()
            closeModal()
        } else {
            updatealuno(index, aluno)
            updateTable()
            closeModal()
        }
    }
}

const createRow = (aluno, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${aluno.nome}</td>
        <td>${aluno.email}</td>
        <td>${aluno.celular}</td>
        <td>${aluno.cidade}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}" >Excluir</button>
        </td>
    `
    document.querySelector('#tablealuno>tbody').appendChild(newRow)
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tablealuno>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
    const dbaluno = readaluno()
    clearTable()
    dbaluno.forEach(createRow)
}

const fillFields = (aluno) => {
    document.getElementById('nome').value = aluno.nome
    document.getElementById('email').value = aluno.email
    document.getElementById('celular').value = aluno.celular
    document.getElementById('cidade').value = aluno.cidade
    document.getElementById('nome').dataset.index = aluno.index
}

const editaluno= (index) => {
    const aluno = readaluno()[index]
    aluno.index = index
    fillFields(aluno)
    openModal()
}

const editDelete = (event) => {
    if (event.target.type == 'button') {

        const [action, index] = event.target.id.split('-')

        if (action == 'edit') {
            editaluno(index)
        } else {
            const aluno = readaluno()[index]
            const response = confirm(`Deseja realmente excluir o aluno ${aluno.nome}`)
            if (response) {
                deletealuno(index)
                updateTable()
            }
        }
    }
}

updateTable()

// Eventos
document.getElementById('cadastraraluno')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

document.getElementById('salvar')
    .addEventListener('click', savealuno)

document.querySelector('#tablealuno>tbody')
    .addEventListener('click', editDelete)

document.getElementById('cancelar')
    .addEventListener('click', closeModal)