<template>
    <div class="overflow-auto h-table">
        <table class="table table-sm bg-white rounded-none">
            <!-- head -->
            <thead>
                <tr>
                    <th class="w-12" />
                    <th>Nombre</th>
                    <th>Permisos</th>
                    <th>Activo</th>
                    <th class="w-12" />
                </tr>
            </thead>

            <tbody>
                <!-- row 1 -->
                <tr v-for="(item, i) in sellers" :key="`seller-row-${item.id}`"
                    :class="i % 2 === 0 ? 'bg-table-row' : 'bg-white'">
                    <td>
                        <span class="text-sm text-black-3">{{ i + 1 }}</span>
                    </td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.permissions }}</td>
                    <td>
                        <div class="form-control">
                            <label class="label cursor-pointer">
                                <input type="checkbox" class="toggle toggle-sm toggle-success"
                                    :checked="item.status === 'active'" @change="">
                            </label>
                        </div>
                    </td>
                    <td>
                        <div class="dropdown dropdown-left">
                            <div tabindex="0" role="button"
                                class="btn w-8 h-8 btn-xs rounded-full aspect-square grid place-items-center cursor-pointer">
                                <icon-dots-vertical class="w-4 h-4" />
                            </div>
                            <ul tabindex="0"
                                class="dropdown-content menu bg-base-100 text-brand-black rounded-box z-[1] w-52 p-2 shadow">
                                <li @click.stop="handlerEditSeller">
                                    <a>
                                        <icon-edit class="w-4 h-4" />
                                        Editar usuario
                                    </a>
                                </li>
                                <li @click.stop="">
                                    <a class="text-brand-pink">
                                        <icon-trash class="w-4 h-4" />
                                        Eliminar usuario
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { IconDotsVertical, IconEdit, IconTrash } from '@tabler/icons-vue'
import { getAllSellers } from '@/api/electron';
import { Seller, Response } from '@/api/interfaces';

const props = defineProps<{
    search: String
}>()

//EMITS
const emit = defineEmits<{
    (e: 'handlerEditSeller'): void
}>()

const sellers = ref<Array<Seller>>([]);

const fetchAllSellers = async () => {
    getAllSellers((response: Response<Seller[]>) => {
        if (!response.success) {
            console.error('Error fetching sellers:', response.message);
            return;
        }
        sellers.value = response.response;
    })
}

const handlerEditSeller = () => {
    emit('handlerEditSeller')
}

onMounted(async () => {
    await fetchAllSellers()
});

defineExpose({ fetchAllSellers })
</script>
