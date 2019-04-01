<template>
	<section style="min-width: 1155px;">
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model.trim="filters.phone" placeholder="手机号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item>
				<!-- <el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item> -->
			</el-form>
		</el-col>
		<template>
		  <el-tabs v-model="activeName" @tab-click="handleClick">
		    <el-tab-pane label="全部" name="4"></el-tab-pane>
		    <el-tab-pane label="待取件" name="0"></el-tab-pane>
		    <el-tab-pane label="已取件" name="1"></el-tab-pane>
		    <el-tab-pane label="已发件" name="2"></el-tab-pane>
		    <el-tab-pane label="失败" name="3"></el-tab-pane>
		  </el-tabs>
		</template>

		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" style="width: 100%;" border>
			<el-table-column type="index" width="55">
			</el-table-column>
			<el-table-column prop="sendname" label="收件人" width="120" align="center" >
			</el-table-column>
			<el-table-column prop="sendphone" label="收件人手机号" width="130" align="center">
			</el-table-column>
			</el-table-column>
			<el-table-column prop="useraddress" label="寄件地址"  align="center" show-overflow-tooltip>
				<template slot-scope="scope">
					{{scope.row.useraddress + scope.row.userdetialaddress}}
				</template>
			</el-table-column>
			<el-table-column prop="usercontent" label="寄件描述"  width="130" align="center"
			show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="state" label="状态"  width="100" align="center">
				<template slot-scope="scope">
					<span :style="color[scope.row.state]">{{ state[scope.row.state] }}</span>
				</template>
			</el-table-column>
			<el-table-column prop="createtime" label="订单创建时间"  width="130" align="center" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="updatetime" label="订单修改时间"  width="130" align="center" show-overflow-tooltip>
			</el-table-column>
			<el-table-column label="操作" align="center" width="100">
				<template slot-scope="scope">
					<el-button size="small" type="danger" @click="handleEdit(scope.$index, scope.row)">详细信息</el-button>
					<!-- <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button> -->
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">取件信息</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total" style="float:right;" :current-page="page">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="详细信息" v-model="editFormVisible" :close-on-click-modal="false" style="min-width: 700px">
			<el-form :model="editForm" :inline="true" label-width="80px" ref="editForm">
				<el-form-item label="姓名" prop="name">
					<el-input v-model="editForm.name" auto-complete="off" disabled></el-input>
				</el-form-item>
				<el-form-item label="手机号" prop="userphone">
					<el-input v-model="editForm.userphone" auto-complete="off" disabled></el-input>
				</el-form-item>
				<el-form-item label="身份证号" prop="useridentify">
					<el-input v-model="editForm.useridentify" auto-complete="off" disabled></el-input>
				</el-form-item>
				<el-form-item label="快递描述" prop="usercontent">
					<el-input v-model="editForm.usercontent" auto-complete="off" disabled></el-input>
				</el-form-item>
					<el-form-item label="收件人" prop="sendname">
					<el-input v-model="editForm.sendname" auto-complete="off" disabled></el-input>
				</el-form-item>
					<el-form-item label="收件号" prop="sendphone">
					<el-input v-model="editForm.sendphone" auto-complete="off" disabled></el-input>
				</el-form-item>
				<el-form-item label="地址" prop="useraddress">
					<el-input v-model="editForm.useraddress" :rows="2" type="textarea" style="width:196.4px;" disabled></el-input>
				</el-form-item>
				<el-form-item label="详细地址" prop="userdetialaddress">
					<el-input v-model="editForm.userdetialaddress" :rows="2" type="textarea" style="width:196.4px;" disabled></el-input>
				</el-form-item>
				<el-form-item label="下单时间" prop="createtime">
					<el-input v-model="editForm.createtime" auto-complete="off" disabled></el-input>
				</el-form-item>
				<el-form-item label="快递编号" prop="postid">
					<el-input v-model="editForm.postid" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="状态">
					<el-select v-model="editForm.state" placeholder="请选择" @change="getoption">
					    <el-option
					      v-for="item in options"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value"
					      :disabled="item.disabled">
					    </el-option>
					 </el-select>
				 </el-form-item>
				<el-form-item label="原因" v-show="reasonVisable">
					<el-input v-model="editForm.reason"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<!-- <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="姓名" prop="name">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="性别">
					<el-radio-group v-model="addForm.sex">
						<el-radio class="radio" :label="1">男</el-radio>
						<el-radio class="radio" :label="0">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="年龄">
					<el-input-number v-model="addForm.age" :min="0" :max="200"></el-input-number>
				</el-form-item>
				<el-form-item label="生日">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.birth"></el-date-picker>
				</el-form-item>
				<el-form-item label="地址">
					<el-input type="textarea" v-model="addForm.addr"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog> -->
	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getUserListPage, removeUser, batchRemoveUser, submitSendState, addUser ,getSendExpress } from '../../api/api';

	export default {
		data() {
			return {
				filters: {
					phone: ''//查询手机号
				},
				users: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列
				pageSize:10,//每页数
				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				state:util.stateSendExpress,//状态
				color:["color:#CD4F39","color:#F7BA2A","color:#13CE66","color:#FF4949"],//颜色
				activeName:'4',//标签页

				//编辑界面数据
				editForm: {

				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				options:[
					{
					    value: '0',
	      				label: '待取件',
	      				disabled: false
					},
					{
					    value: '1',
	      				label: '已取件',
	      				disabled: false
					},
					{
					    value: '2',
	      				label: '已发件',
	      				disabled: false
					},
					{
					    value: '3',
	      				label: '失败',
	      				disabled: false
					}
				],
				reasonVisable:false,

				//新增界面数据
				addForm: {
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
				}

			}
		},
		methods: {
			//性别显示转换
			formatSex: function (row, column) {
				return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getUsers();
			},
			//获取用户列表
			getUsers() {
				let para = {
					page: this.page,
					pageSize:this.pageSize,
					state:this.activeName,
					phone:this.filters.phone
				};
				this.listLoading = true;
				//NProgress.start();
				getSendExpress(para).then((res) => {
					this.total = res.data.total;
					this.users = res.data.data;
					this.listLoading = false;
					//NProgress.done();
				}).catch(() => {
					 this.$message.error('网络出错！请注意检查');
				});;
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { id: row.id };
					removeUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getUsers();
					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				for (var i = 0; i < this.options.length; i++) {
					if(i < Number(row.state)){
						this.options[i].disabled = true ; 
					}else{
						this.options[i].disabled = false ;
					}
				}
				if(row.state == '3'){
					this.reasonVisable = true;
				}
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
				};
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							//NProgress.start();
							let para = Object.assign({}, this.editForm);
							if(para.state == '3' && (para.reason == '' || para.reason == null)){
								 this.$message.error('失败原因必填！');
								 return;
							}
							this.editLoading = true;
							submitSendState(para).then((res) => {
								this.editLoading = false;
								if(res.data.code == 1){
									this.$message({
										message: res.data.msg,
										type: 'success'
									});
									this.getUsers();
								}else{
									 this.$message({
							          showClose: true,
							          message: res.data.msg,
							          type: 'error'
							        });
								}
								this.editFormVisible = false;
							}).catch((ret) => {
								this.editLoading = false;
								this.$message.error('网络出错！请注意检查');
							});
						});
					}
				});
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.addForm);
							para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							addUser(para).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getUsers();
							});
						});
					}
				});
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			//批量删除
			batchRemove: function () {
				var ids = this.sels.map(item => item.id).toString();
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { ids: ids };
					batchRemoveUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getUsers();
					});
				}).catch(() => {

				});
			},
			handleClick:function(tab, event){
				console.log(this.activeName);
				this.page = 1;
				this.getUsers();
			},
			getoption:function(val){
				// console.log(val);
				if(val == '3'){
					this.reasonVisable = true;
				}else{
					this.reasonVisable = false;
				}

			}
		},
		mounted() {
			this.getUsers();
			// console.log(util.stateExpress);
		}
	}

</script>

<style scoped>

</style>
<style type="text/css">
	.el-dialog--small{
		min-width: 700px;
	}
	.el-select>.el-input{
		width:192px;
	}
</style>