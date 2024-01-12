import { ReactElement, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { Column } from "react-table";
import { useSelector } from "react-redux"
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { RootState } from "../../redux/store";
import { useAllUsersQuery } from "../../redux/api/userAPI";
import { CustomError } from "../../types/api-types";
import toast from "react-hot-toast";
import { Skeleton } from "../../components/Loader";

interface DataType {
  avatar: ReactElement;
  name: string;
  email: string;
  gender: string;
  role: string;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Avatar",
    accessor: "avatar",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Gender",
    accessor: "gender",
  },
  {
    Header: "Email",
    accessor: "email",
  },
  {
    Header: "Role",
    accessor: "role",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];


// const arr: Array<DataType> = [
//   {
//     avatar: (
//       <img
//         style={{
//           borderRadius: "50%",
//         }}
//         src={img}
//         alt="Shoes"
//       />
//     ),
//     name: "Emily Palmer",
//     email: "emily.palmer@example.com",
//     gender: "female",
//     role: "user",
//     action: (
//       <button>
//         <FaTrash />
//       </button>
//     ),
//   },

//   {
//     avatar: (
//       <img
//         style={{
//           borderRadius: "50%",
//         }}
//         src={img2}
//         alt="Shoes"
//       />
//     ),
//     name: "May Scoot",
//     email: "aunt.may@example.com",
//     gender: "female",
//     role: "user",
//     action: (
//       <button>
//         <FaTrash />
//       </button>
//     ),
//   },
// ];

const userImg =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJxA5cTf-5dh5Eusm0puHbvAhOrCRPtckzjA&usqp";

const Customers = () => {
  const { user } = useSelector((state: RootState) => state.userReducer)

  const { isLoading, data, isError, error } = useAllUsersQuery(user?._id!)

  const [rows, setRows] = useState<DataType[]>([]);

  if(isError){
    const err = error as CustomError
    toast.error(err.data.message) 
  }

  useEffect(() => {
    if(data){
      setRows(
        data.users.map((i) => ({
          avatar: (
            i.photo ? 
            <img style={{ borderRadius: "50%", height: '40px', width: '40px' }} src={i.photo} alt={i.name} /> : 
            <img style={{ borderRadius: "50%", height: '40px', width: '40px' }} src={userImg} alt={i.name} />
          ),
          name: i.name,
          email: i.email,
          gender: i.gender,
          role: i.role,
          action: ( 
            <button className="customer-action-btn">
              {i.role !== "admin" ? <FaTrash /> : "Not allowed"}
            </button> 
          )
        }))
      )
    }
  }, [data])

  console.log(rows)

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Customers",
    rows.length > 6
  )();

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>{isLoading ? <Skeleton length={30} /> : Table}</main>
    </div>
  );
};

export default Customers;
