// import React, { useState, useRef, useEffect } from 'react';
// import { DataTable } from 'primereact/datatable';
// import { Column } from 'primereact/column';
// import { Toast } from 'primereact/toast';
// import AdminButton from './AdminButton';


// export default function UserTable(props) {

    
//     const [selectedUser, setSelectedUser] = useState(null);
//     const toast = useRef(null);


//     const onRowSelect = (event) => {
//         toast.current.show({ severity: 'info', summary: 'Product Selected', detail: `Name: ${event.data.userName}`, life: 3000 });

//         console.log(toast); 
//     };

//     const onRowUnselect = (event) => {
//         toast.current.show({ severity: 'warn', summary: 'Product Unselected', detail: `Name: ${event.data.name}`, life: 3000 });
//     };

//     useEffect(() => {
//         // ProductService.getProductsMini().then((data) => setSelectedUser(data));
//     }, []);

//     return (
//         <div className="card">
//             <Toast ref={toast} />
//             <DataTable value={props.users} selectionMode="single" selection={selectedUser} onSelectionChange={(e) => setSelectedUser(e.value)} dataKey="userId"
//                     onRowSelect={onRowSelect} onRowUnselect={onRowUnselect} metaKeySelection={false} tableStyle={{ minWidth: '50rem' }}  >
//                 <Column field="userID" header="User ID"></Column>
//                 <Column field="userName" header="Name"></Column>
//                 <Column field="phone" header="Phone Number"></Column>
//                 <Column field="group" header="Quantity"></Column>
//                 <Column field="g360Admin" header="G360Admin"><AdminButton adminStatus={false}></AdminButton></Column>
//                 <Column field="active" header="Status"></Column>
//                 <Column field="group" header="Reset Password"></Column>
//             </DataTable>
//         </div>
//     );
// }
        