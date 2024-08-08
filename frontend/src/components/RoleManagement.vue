<template>
  <div class="role-management">
    <h2>角色管理</h2>
    <div class="add-role">
      <input v-model="newRoleName" placeholder="输入新角色名称" />
      <button @click="addRole">添加角色</button>
    </div>
    <ul class="role-list">
      <li v-for="role in eventStore.familyMembers" :key="role.id" class="role-item">
        <template v-if="editingRole === role.id">
          <input v-model="editedRoleName" @keyup.enter="updateRole(role.id)" />
          <button @click="updateRole(role.id)">保存</button>
          <button @click="cancelEdit">取消</button>
        </template>
        <template v-else>
          <span>{{ role.name }}</span>
          <button v-if="!role.isDefault" @click="startEdit(role)">编辑</button>
          <button v-if="!role.isDefault" @click="deleteRole(role.id)">删除</button>
        </template>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useEventStore } from '@/stores/events';

const eventStore = useEventStore();

const newRoleName = ref('');
const editingRole = ref(null);
const editedRoleName = ref('');

const addRole = () => {
  if (newRoleName.value.trim()) {
    eventStore.addRole(newRoleName.value.trim());
    newRoleName.value = '';
  }
};

const startEdit = (role) => {
  editingRole.value = role.id;
  editedRoleName.value = role.name;
};

const updateRole = (roleId) => {
  if (editedRoleName.value.trim()) {
    eventStore.updateRole(roleId, editedRoleName.value.trim());
    cancelEdit();
  }
};

const cancelEdit = () => {
  editingRole.value = null;
  editedRoleName.value = '';
};

const deleteRole = (roleId) => {
  if (confirm('确定要删除这个角色吗？')) {
    eventStore.deleteRole(roleId);
  }
};
</script>
  
  <style scoped>
  .role-management {
    padding: 20px;
  }
  
  .add-role {
    margin-bottom: 20px;
  }
  
  .role-list {
    list-style-type: none;
    padding: 0;
  }
  
  .role-item {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
  }
  
  .role-item span {
    margin-right: 10px;
  }
  
  button {
    margin-left: 5px;
  }
  </style>