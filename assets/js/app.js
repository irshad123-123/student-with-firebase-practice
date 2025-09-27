let cl = console.log;

const studentForm = document.getElementById('studentForm')
const fnameControler = document.getElementById('fname')
const lnameControler = document.getElementById('lname')
const emailControler = document.getElementById('email')
const contactControler = document.getElementById('contact')
const addStudent = document.getElementById('addStudent')
const updateStudent = document.getElementById('updateStudent')
const studentContainer = document.getElementById('studentContainer')
const loader = document.getElementById('loader')

let BASE_URL = `https://crud-35fc1-default-rtdb.asia-southeast1.firebasedatabase.app`
let Student_URL = `${BASE_URL}/student.json`

const objtoArr = (obj)=>{
    let studentArr = []
    for(const key in obj){
        studentArr.push({...obj[key], id:key})
    }
    return studentArr
    // cl(studentArr)
}

const studentTemplating = (obj) =>{
    let result = ``
    obj.forEach((f, i)=>{
        result += `          <tr id="${f.id}">
                                <td>${i+1}</td>
                                <td>${f.fname}</td>
                                <td>${f.lname}</td>
                                <td>${f.email}</td>
                                <td>${f.contact}</td>
                                <td><i onclick = "onEdit(this)" class="fa-solid fa-user-pen fa-2x text-success" role="button"></i></td>
                                <td><i onclick = "onRemove(this)" class="fa-solid fa-trash fa-2x text-danger" role="button"></i></td>
                            </tr>`
    })
    studentContainer.innerHTML = result;
}

const onEdit = async (ele) =>{
    let Edit_Id = ele.closest('tr').id
    cl(Edit_Id)
    localStorage.setItem('Edit_Id', Edit_Id)
    let Edit_URL = `${BASE_URL}/student/${Edit_Id}.json`
    
    let res = await makeApiCall('GET', Edit_URL, null)
    cl(res)
    fnameControler.value = res.fname;
    lnameControler.value = res.lname;
    emailControler.value = res.email;
    contactControler.value = res.contact;

    addStudent.classList.add('d-none')
    updateStudent.classList.remove('d-none')
    studentForm.scrollIntoView({behavior:"smooth", block:"center"})
}

const onRemove = async(ele) =>{
    let isConfirmed = confirm('Are you sure want to remove this student details!!!')

    if(isConfirmed){
        let Remove_Id = ele.closest('tr').id;
    let Remove_URL = `${BASE_URL}/student/${Remove_Id}.json`
    let res = await makeApiCall('DELETE', Remove_URL, null)
    ele.closest('tr').remove()

    let tr = studentContainer.querySelectorAll('tr')
    cl(tr)
    tr.forEach((row, i)=>{
        row.children[0].innerText = i+1
    })
    }
}

const makeApiCall = async (methodName, api_url, msgBody)=>{
    let msg = msgBody ? JSON.stringify(msgBody) : null;
    loader.classList.remove('d-none')
    try{
        let res = await fetch(api_url, {
            method:methodName,
            body:msg,
            headers:{
                'auth':'JWT token from LS',
                'content-type':'application/json'
            }
        })
        if(!res.ok){
            throw new Error('Network Error')
        }
        return res.json()
    }catch{
        cl('Error')
    }finally{
        loader.classList.add('d-none')
    }
}

const makeAll = async ()=>{
    let res = await makeApiCall('GET', Student_URL, null)
    let posts = objtoArr(res)
    studentTemplating(posts)
}
makeAll()

const onSubmitStudent =  async (eve) =>{
    eve.preventDefault()
    let obj = {
        fname : fnameControler.value,
        lname : lnameControler.value,
        email : emailControler.value,
        contact : contactControler.value
    }
    cl(obj)
  let res = await  makeApiCall('POST', Student_URL, obj)
  studentForm.reset()
//   studentTemplating(res)
let tr = document.createElement('tr')
tr.id = res.name;
let count = document.querySelectorAll('tr').length
tr.innerHTML=`                  <td>${count}</td>
                                <td>${obj.fname}</td>
                                <td>${obj.lname}</td>
                                <td>${obj.email}</td>
                                <td>${obj.contact}</td>
                                <td><i onclick = "onEdit(this)" class="fa-solid fa-user-pen fa-2x text-success" role="button"></i></td>
                                <td><i onclick = "onRemove(this)" class="fa-solid fa-trash fa-2x text-danger" role="button"></i></td>`
studentContainer.append(tr)

tr.scrollIntoView({behavior:'smooth', block:'center'})

}

const onUpdateDetails = async (eve) =>{
    let Update_Id = localStorage.getItem('Edit_Id')
    let Update_URL = `${BASE_URL}/student/${Update_Id}.json`
    let Update_obj = {
        fname : fnameControler.value,
        lname : lnameControler.value,
        email : emailControler.value,
        contact : contactControler.value,
        id : Update_Id
    }
    cl(Update_obj)
    let res = await makeApiCall('PATCH', Update_URL, Update_obj)
    studentForm.reset()
    let tr = document.getElementById(Update_Id).children
    tr[1].innerHTML = res.fname
    tr[2].innerHTML = res.lname
    tr[3].innerHTML = res.email
    tr[4].innerHTML = res.contact

    addStudent.classList.remove('d-none')
    updateStudent.classList.add('d-none')
document.getElementById(Update_Id).scrollIntoView({behavior:'smooth', block:'center'})

}

studentForm.addEventListener('submit', onSubmitStudent)

updateStudent.addEventListener('click', onUpdateDetails)
