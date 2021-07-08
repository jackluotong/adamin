<template>
    <div>
         <Modal v-model.trim="modalDelete" width="450" title="删除参数配置提示">
            <div>
                <p>确定删除该参数配置吗？</p>
            </div>
            <div slot="footer">
                <Button type="text" @click="cancelDelete" size="large">取消</Button>
                <Button type="primary" @click="handleSubmitDelete" size="large">确定</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
export default {

}
</script>
