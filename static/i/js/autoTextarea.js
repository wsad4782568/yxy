//var maxHeight=null
//var qrysTextareacClas=document.querySelector(".freebackReplyTextarea")
//var minHeight=qrysTextareacClas.offsetHeight//������ʼ�߶�

function HAuto(qrysTextareacClas,minHeight){
    console.log("aa2")
    var height,style=qrysTextareacClas.style
    qrysTextareacClas.style.height =minHeight + 'px'
    console.log(qrysTextareacClas.scrollHeight)
    //�ж����ڵĸ߶Ⱥͳ�ʼ�ĸ߶�
    if (qrysTextareacClas.scrollHeight >minHeight) {
        if (qrysTextareacClas.maxHeight && qrysTextareacClas.scrollHeight > qrysTextareacClas.maxHeight) {
            height = qrysTextareacClas.maxHeight;
            style.overflowY = 'scroll'
            console.log(height+"a1")
        } else {
            height = qrysTextareacClas.scrollHeight;
            style.overflowY = 'hidden'
            console.log(height+"aa2")

        }
        style.height = height  + 'px'
        console.log(height+"aaa3")
    }
}
