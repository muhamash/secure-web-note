import UsersPage from "@/components/modules/users/UsersPageAdmin";
import { fetchUsersAction } from "@/lib/services/admin/admin.service";

export default async function AdminUsersPage ({searchParams})
{
  const page = Number((await searchParams)?.page) || 1;
  const limit = Number( ( await searchParams )?.limit ) || 2;
  
  const allUsersData = await fetchUsersAction( page, limit );

  console.log(allUsersData)

  return (
    <UsersPage allUsers={ allUsersData?.data } meta={ allUsersData?.data?.meta } />
  )
}
