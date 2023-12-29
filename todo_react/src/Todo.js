import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { toast, ToastContainer  } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';




const Todo = () => {
    const [modalshow, setModalshow] = useState(false);
    const [Editcount, setEditcount] = useState(0) // get edit count to disable edit button
    const [todoinitialdata, setTodoInitialData] = useState({
        status: 'Pending',
        name: null,
        assignTime: null,
        completeTime: null,
        editCount: Editcount,

    })

    const [todoData, setTodoData] = useState([]);          
    const [SearchBox, setSearchBox] = useState('')  // search box input from user
    const [openInput, setopenInput] = useState(false) // add input box 
    const [openInputIndex, setopenInputIndex] = useState(false) // add input box with indexing
    const [editTask, seteditTask] = useState('') // edit the existing task


         // function-----------------
         //  post method-----------

        const handleSubmit = () => {
        if (todoinitialdata.name === '' || todoinitialdata.name === null) {
            toast.warning('Enter The Task')
        }
        else {
            const newTodoData = {
                ...todoinitialdata,
                assignTime: new Date().toLocaleDateString() + ' @ ' + new Date().toLocaleTimeString(),
            };   
            axios.post('http://localhost:3000/todo', newTodoData).then((res) => {
                toast.success('Task Added successfully' , {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 2000,
                });
                console.log(todoinitialdata , "dataa");
                getAllTodoData()
                setModalshow(false)
                document.getElementById("todo-input").value = ""
                setTodoInitialData({

                    status: 'Pending',
                    name: null,
                    assignTime: null,
                    completeTime: null,
                    editCount: Editcount,

                })
                console.log(res);
            }).catch((err) => {
                toast.warning('Error In adding new ask' , {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 2000,
                });
                console.log(err);
            })
            console.log('inside');
        }
    } // post data to the json file 






 // getmethod----------
    const getAllTodoData = () => {
        axios.get('http://localhost:3000/todo').then((res) => {
            setTodoData(res.data)
            console.log(res);
        }).catch((err) => {
            console.log(err);
        })

    }

    useEffect(() => {
        getAllTodoData()
    }, [])





    // delete method====================
    const handleDelete = (item) => {
        const { id } = item
        axios.delete('http://localhost:3000/todo/' + id).then(() => {
            toast.info('Task Deleted' , {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000,
            })
            getAllTodoData()
        }).catch(() => toast.error('Connection Error!' , {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: 2000,
        }))
    } // task deleted from backend and ui



    // task completed==========
    const handleCompleted = (item) => {
        const { id } = item;
        const newCompleteTime = new Date().toLocaleDateString() + ' @ ' + new Date().toLocaleTimeString();
        axios.patch('http://localhost:3000/todo/' + id, {
            status: 'Completed',
            completeTime: newCompleteTime
        }).then((res) => {
            toast.success('Task Completed' , {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 2000,
            })
            getAllTodoData()
        }).catch((err) => toast.error('Connection Error!' , {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: 2000,
        }))
    }


//  search item================
    const SearchItem = todoData.filter((item) => {
        if (SearchBox === '') {
            return item
        }
        else if (item.name.toString().toLowerCase().includes(SearchBox.toLowerCase())) {
            return item
        }
    })
    





    // counts all pending and completed start here ==============================
    const count = todoData.filter((item) => {
        return item.status
    }).length
    const Pcount = todoData.filter((item) => {
        return item.status === "Pending"
    }).length
    const Ccount = todoData.filter((item) => {
        return item.status === "Completed"
    }).length
    // counts all pending and completed ends here ================================





// update here======================
    const handleUpdate = (item) => {
        const { id } = item
        axios.patch('http://localhost:3000/todo/' + id, {
            name: editTask ? editTask : item.name,
            assignTime: new Date().toLocaleDateString() + ' @ ' + new Date().toLocaleTimeString(),
            editCount: Editcount,
          
        }).then((res) => {
            getAllTodoData()
            setopenInput(false)
            setEditcount(Editcount + 1)
            toast.success('Task edited')
        }).catch((err) => toast.error('Connection Error!'))
    } // update/edit  the existing task





         return (

        <>

             {/* button content */}
            <div className='todo-list'> Todo List :</div>

            <div className='d-flex gap-2 count-btns'>
                <div>
                    <button className="btn btn-info my-2 my-sm-0 pe-none" type="button">{`All ${count}`}</button>
                </div>
                <div>
                    <button className="btn btn-danger my-2 my-sm-0 pe-none" type="button">{`Pending ${Pcount}`}</button>
                </div>
                <div>
                    <button className="btn btn-success my-2 my-sm-0 pe-none" type="button">{`Completed ${Ccount}`}</button>
                </div>
                <div>
                    <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" onChange={(e) => setSearchBox(e.target.value)} />
                </div>
                <div>
                    <button className="btn btn-primary my-2 my-sm-0" type="button" onClick={() => setModalshow(true)}>Add ToDo</button>
                </div>
            </div>




    
     {/* modal starts here============ */}
            <div className={`modal fade ${modalshow && 'd-block show'}`} tabindex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Create Todo...</h5>

                        </div>
                        <div className="modal-body">
                            <input className='form-control' id="todo-input" placeholder='Add todo' onChange={(e) => setTodoInitialData((prev) => ({ ...prev, name: e.target.value }))} />
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" onClick={handleSubmit}>Add</button>
                            <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => setModalshow(false)}>Close</button>
                        </div>
                    </div>
                </div>
            </div>



            {/* table content */}
            <table class="table table-striped table-dark">
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Status</th>
                        <th scope="col">Task</th>
                        <th scope="col" className='assign-time'>Assigned Date & Time</th>
                        <th scope="col " className='completed-time'>Complete Date & Time</th>
                        <th scope="col">Mark As Done</th>
                        <th scope="col">Action Button</th>
                    </tr>
                </thead>

               <tbody>
                    {
                        SearchItem.map((item, index) => {
                            return (
                                <tr>
                                    <th scope="row">{index + 1}</th>
                                    <td className={item.status === "Pending" ? 'text-success' : 'text-danger'}>{item.status}</td>
                                    <td className={item.status === 'Completed' && 'text-decoration-line-through'}>{openInput && openInputIndex === index ? <input className='form-control w-75' defaultValue={item.name} onChange={(e) => seteditTask(e.target.value)} /> : item.name}</td>
                                    <td className='assign-time'>{item.assignTime}</td>
                                    <td className='completed-time'>{item.completeTime}</td>
                                    <td className=' checkbox'> <input type="checkbox" name="" id="" disabled={item.status === 'Completed'} readOnly checked={item.status === 'Completed'} onClick={() => handleCompleted(item)} /></td>
                                    <td>

                                        {
                                            openInput && openInputIndex === index ?
                                                <div className='d-flex gap-2'>
                                                    <button className='btn btn-danger' onClick={() => setopenInput(false)}>Cancel</button>
                                                    <button className='btn btn-primary' onClick={() => handleUpdate(item)}>Save</button>
                                                </div>
                                                :
                                                <div className='d-flex gap-2'>
                                                    <button className='btn btn-primary' disabled={item.status === 'Completed' || item.editCount === 2} onClick={() => { setopenInput(true); setopenInputIndex(index)}}>Edit</button>
                                                    <button className='btn btn-danger' onClick={() => handleDelete(item)} >Delete</button>
                                                </div>
                                        }

                                        </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>


        </>
    )
}

export default Todo