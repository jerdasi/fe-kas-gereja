import type {
  TUserCollection,
  TUserDocument,
  TUserCreatePayload,
  TUserUpdatePayload,
  TUserResponse,
  TUserDeleteResponse,
} from "~/types/users";
import { GET, POST, PATCH, DELETE } from "~/composables/fetch";

export const useUsers = () => {
  const baseURL = `${import.meta.env.VITE_API_KAS_GEREJA}/users`;

  const userCollection = ref<TUserCollection>([]);
  const userDocument = ref<TUserDocument | null>(null);
  const isLoading = ref<boolean>(false);

  // ── Collection ───────────────────────────────────────────────────────────

  const getUsers = async () => {
    isLoading.value = true;
    try {
      userCollection.value = await GET<TUserCollection>(baseURL, {});
    } catch (err) {
      console.error("[getUsers]", err);
    } finally {
      isLoading.value = false;
    }
  };

  // ── Document (single) ────────────────────────────────────────────────────

  const getUser = async (id: number) => {
    isLoading.value = true;
    try {
      userDocument.value = await GET<TUserDocument>(`${baseURL}/${id}`, {});
    } catch (err) {
      console.error("[getUser]", err);
      userDocument.value = null;
    } finally {
      isLoading.value = false;
    }
  };

  // ── Create ───────────────────────────────────────────────────────────────

  const createUser = async (payload: TUserCreatePayload) => {
    isLoading.value = true;
    try {
      const response = await POST<TUserResponse>(baseURL, payload);
      await getUsers();
      return response;
    } catch (err) {
      console.error("[createUser]", err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // ── Update ───────────────────────────────────────────────────────────────

  const updateUser = async (id: number, payload: TUserUpdatePayload) => {
    isLoading.value = true;
    try {
      const response = await PATCH<TUserResponse>(`${baseURL}/${id}`, payload);
      await getUsers();
      return response;
    } catch (err) {
      console.error("[updateUser]", err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // ── Delete ───────────────────────────────────────────────────────────────

  const deleteUser = async (id: number) => {
    isLoading.value = true;
    try {
      await DELETE<TUserDeleteResponse>(`${baseURL}/${id}`, {});
      await getUsers();
    } catch (err) {
      console.error("[deleteUser]", err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // ── Reset ────────────────────────────────────────────────────────────────

  const resetUserDocument = () => {
    userDocument.value = null;
  };

  return {
    userCollection,
    userDocument,
    isLoading,
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    resetUserDocument,
  };
};
