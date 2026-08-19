import { Container } from "@mui/material";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Skeleton } from "primereact/skeleton";

const LogbookSkeleton = () => {
    return (
        <Container  sx={{marginLeft:"3rem",maxWidth:"95% !important"}}>
        <DataTable value={[...Array(12)]} className="p-datatable-striped">
        <Column field="code" style={{ width: '20%' }} body={<Skeleton />}></Column>
        <Column field="name"  style={{ width: '20%' }} body={<Skeleton  />}></Column>
        <Column field="category"  style={{ width: '20%' }} body={<Skeleton  />}></Column>
        <Column field="quantity"  style={{ width: '20%' }} body={<Skeleton  />}></Column>
        <Column field="quantity"  style={{ width: '20%' }} body={<Skeleton  />}></Column>
    </DataTable>
    </Container>
    );
}

export default LogbookSkeleton;