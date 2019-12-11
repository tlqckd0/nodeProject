module.exports = (sequeluze, DataTypes) =>{
    return sequeluze.define('recommend',{
        userId:{
            type:DataTypes.INTEGER
        }
    },{
        timestamps:true,
        paranoid:true
    })
}