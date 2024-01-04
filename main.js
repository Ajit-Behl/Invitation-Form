let inValue = []
const form = document.querySelector('.rigth-col form')
const input = document.querySelectorAll('.rigth-col form input')
const fullName = document.getElementById('fullName')
const email = document.getElementById('email')
const contact = document.getElementById('contact')
const apiUrl = 'http://127.0.0.1:3000/invites'

function ValidateEmail(mail) {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(form.email.value)) {
    return true
  } else {
    return false
  }
}

function displayError() {
  document.getElementById('response').style.display = 'block'
}

function postDataToAPI() {
  const inputValues = {
    name: fullName.value,
    email: email.value,
    phone_number: contact.value,
  }

  fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(inputValues),
  })
    .then((response) => {
      if (!response.ok) {
        if (response.status === 422) {
          return response.json().then((data) => {
            throw new Error(data.error)
          })
        } else {
          throw new Error('Network response was not ok')
        }
      }
      return response.json()
    })
    .then((data) => {
      console.log('Response:', data)
      displaySuccess()
      setTimeout(clearFields, 5000)
    })
    .catch((error) => {
      console.error('Error:', error.message)
      alert('Error:' + error.message)
    })
}

function clearFields() {
  input.forEach((input) => {
    input.value = ''
    document.getElementById('output').style.display = 'none'
  })
}

function onSubmit() {
  clearErrors()
  //if (validate())
  postDataToAPI()
}

function clearErrors() {
  input.forEach((input) => {
    input.parentElement.classList.remove('error')
  })
}
function validate() {
  let valid = true
  input.forEach((input) => {
    if (input.type === 'email') {
      if (!ValidateEmail(input.value)) {
        valid = false
        input.parentElement.classList.add('error')
      }
    } else {
      if (!input.value) {
        valid = false
        input.parentElement.classList.add('error')
      }
    }
  })
  return valid
}

function displaySuccess() {
  document.getElementById('output').style.display = 'block'
}

function openTab(evt, tabName) {
  var i, tabcontent, tablinks
  tabcontent = document.getElementsByClassName('tabcontent')
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = 'none'
  }
  tablinks = document.getElementsByClassName('tablinks')
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(' active', '')
  }
  document.getElementById(tabName).style.display = 'block'
  evt.currentTarget.className += ' active'
}

document.getElementById('formTab').style.display = 'block'

function deleteRow(id) {
  const tableBody = document.querySelector('#tableBody')
  const row = document.getElementById(id)

  fetch(`http://127.0.0.1:3000/invites/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      console.log('success')
      if (response.ok) {
        // 200. ... its a;; good
        const deleteResponse = response.json()
        tableBody.removeChild(row)
        console.log(`Data with ID ${id} deleted from the database.`)
      } else {
        console.error('Failed to delete data from the database.')
      }
    })
    .catch((error) => console.error('Error:', error))
}

fetch('http://127.0.0.1:3000/invites')
  .then((response) => response.json())
  .then((data) => {
    const tableBody = document.querySelector('#tableBody')

    data.forEach((invite) => {
      const row = document.createElement('tr')
      row.setAttribute('id', invite.id)
      row.innerHTML = `
        <td>${invite.name}</td>
        <td>${invite.email}</td>
        <td>${invite.phone_number}</td>
        <td><button onclick="deleteRow(${invite.id})">Delete</button></td>
      `
      tableBody.appendChild(row)
    })
  })
  .catch((error) => console.error('Error:', error))
