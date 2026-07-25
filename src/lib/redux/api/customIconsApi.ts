import { baseApi } from './baseApi';
import type { SerializedCustomIcon } from '@/src/lib/icons/custom-icon-payload';

export interface CustomIconInput {
  label: string;
  name?: string;
  svg: string;
}

type ListResponse = { success: boolean; data: SerializedCustomIcon[] };
type ItemResponse = { success: boolean; data: SerializedCustomIcon };

export const customIconsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCustomIcons: builder.query<ListResponse, void>({
      query: () => '/custom-icons',
      providesTags: ['CustomIcons'],
    }),
    createCustomIcon: builder.mutation<ItemResponse, CustomIconInput>({
      query: (body) => ({
        url: '/custom-icons',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['CustomIcons'],
    }),
    updateCustomIcon: builder.mutation<ItemResponse, CustomIconInput & { id: number }>({
      query: ({ id, ...body }) => ({
        url: `/custom-icons/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['CustomIcons'],
    }),
    deleteCustomIcon: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `/custom-icons/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['CustomIcons'],
    }),
  }),
});

export const {
  useGetCustomIconsQuery,
  useCreateCustomIconMutation,
  useUpdateCustomIconMutation,
  useDeleteCustomIconMutation,
} = customIconsApi;
