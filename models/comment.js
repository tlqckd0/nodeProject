module.exports = (sequeluze, DataTypes) =>{
    return sequeluze.define('comment',{
        description:{
            type:DataTypes.STRING(200),
            allowNull:false,
        },
        nick:{
            type:DataTypes.STRING(20),
            allowNull:false,
        },
    },{
        timestamps:true,
        paranoid:true
    })
}