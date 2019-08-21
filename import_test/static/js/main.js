var aryFiles = Array();
            $('#uploadFile').fileinput({
                language: 'zh',     // 设置语言，需要引入locales/zh.js文件
                uploadUrl: '/upload/',     // 上传路径
                allowedFileExtensions: ['xls', 'xlsx'],//接收的文件后缀
                maxFileSize: 0,     // 上传文件大小限制，触发 msgSizeTooLarge 提示
                // {name}：将被上传的文件名替换，{size}：将被上传的文件大小替换，{maxSize}：将被maxFileSize参数替换。
                msgSizeTooLarge: '"{name}" ({size} KB) 超过允许的最大上传大小 {maxSize} KB。请重新上传!',
                showPreview: true,  // 展示预览
                showUpload: true,   // 是否显示上传按钮
                showCaption: true,  // 是否显示文字描述
                showClose: false,   // 隐藏右上角×
                uploadAsync: true, // 是否异步上传
                initialPreviewShowDelete: true, // 预览中的删除按钮
                autoReplace: true,  // 达到最大上传数时，自动替换之前的附件
                uploadExtraData: function () {  // uploadExtraData携带附加参数，上传时携带csrftoken
                    return {csrfmiddlewaretoken: $.cookie('csrftoken'), doc_uuid: $('[name=doc_uuid]').val()}
                },
                initialPreview :[],　　// 默认预览设置，回显时会用到
                initialPreviewConfig: [],　　// 默认预览的详细配置，回显时会用到
            }).on("fileuploaded", function (e,data,previewId,index) {
                // 上传成功后触发的事件
            }).on("fileclear", function (e) {
                // 移除按钮触发的事件，用该事件批量删除

                $.ajax({
                    url: '/del_all_att/',
                    method: 'post',
                    dataType: 'json',
                    data: {'aryFiles': JSON.stringify(aryFiles)},
                    success: function (data) {
　　　　　　　　　　　　　　
                    }
                })
            }).on("filepredelete", function (e, key, jqXHR, data) {
                // 预览中删除按钮，删除上传的文件触发的事件
            }).on("fileloaded", function (e, file, previewId) {
                // aryFile.length = 0;
                // 加载预览后触发的事件，将所有文件名添加到全局变量 aryFiles 数组中
                aryFiles.push(file.name);
            })

$('#collapseOne').on('shown.bs.collapse', function () {
    var aObj = document.getElementById("aOne")
    aObj.innerText = '- 姓名'
})

$('#collapseOne').on('hidden.bs.collapse', function () {
    var aObj = document.getElementById("aOne")
    aObj.innerText = '+ 姓名'
})

$('#collapseTwo').on('shown.bs.collapse', function () {
    var aObj = document.getElementById("aTwo")
    aObj.innerText = '- 性别'
})

$('#collapseTwo').on('hidden.bs.collapse', function () {
    var aObj = document.getElementById("aTwo")
    aObj.innerText = '+ 性别'
})

    $('#excel-file').change(function(e) {
            var files = e.target.files;

            var fileReader = new FileReader();
            fileReader.onload = function(ev) {
                try {
                    var data = ev.target.result,
                        workbook = XLSX.read(data, {
                            type: 'binary'
                        }), // 以二进制流方式读取得到整份excel表格对象
                        persons = []; // 存储获取到的数据
                } catch (e) {
                    console.log('文件类型不正确');
                    return;
                }

                // 表格的表格范围，可用于判断表头是否数量是否正确
                var fromTo = '';
                // 遍历每张表读取
                for (var sheet in workbook.Sheets) {
                    if (workbook.Sheets.hasOwnProperty(sheet)) {
                        fromTo = workbook.Sheets[sheet]['!ref'];
                        console.log(fromTo);
                        persons = persons.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
                        break; // 如果只取第一张表，就取消注释这行
                    }
                }

                console.log(persons);
                var name = persons[0]['姓名'];
                var sex = persons[0]['性别'];
                console.log(name);
                console.log(sex);
                var input_name = document.getElementById('id_name')
                var input_sex = document.getElementById('id_sex')
                input_name.value = name
                input_sex.value = sex
            };

            // 以二进制方式打开文件
            fileReader.readAsBinaryString(files[0]);
        });

function cancel(){
                    var file = document.getElementById('excel-file');
                    file.value = ''
}
