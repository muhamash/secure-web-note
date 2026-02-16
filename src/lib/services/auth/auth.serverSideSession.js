import { getServerSession } from "next-auth";
import { authOptions } from "./auth.option";

export const getServerSideUserSession = async () => await getServerSession(authOptions);