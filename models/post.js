module.exports = (sequeluze, DataTypes) =>{
    return sequeluze.define('post',{
        title:{
            type:DataTypes.STRING(40),
            allownull:false,
        },
        description:{
            type:DataTypes.STRING(1000),
        },
        nick:{
            type:DataTypes.STRING(20),
            allownull:false,
        },
        visited:{
            type:DataTypes.INTEGER.UNSIGNED,
            defaultValue:0
        },
        type:{
            type:DataTypes.STRING(10),
            allownull:false,
            defaultValue:'normal'
        },
        recommend:{
            type:DataTypes.INTEGER.UNSIGNED,
            defaultValue:0
        },
        boardName:{
            type:DataTypes.STRING(20),
            allownull:false,
        }
    },{
        timestamps:true,
        paranoid:true
    })
}