export const lexer = (statement) => {
    return statement.split(/\s+/)
        .filter( t=> t.length>0)
        .map(t=>{
            return isNaN(t) ?
                {type:'word',value:t} :
                {type:'number',value:t}
        })
};