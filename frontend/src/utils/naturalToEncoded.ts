export function naturalToEncoded(natural: string) {
    var result = "";

    var tokens = natural
        .substring(1, natural.length - 1)
        .split("  ");
    for (let i = 0; i < tokens.length; i++) {
        var token = tokens[i];

        if (token[0].toUpperCase() == "FORM") 
            result += " FORM " + token[0] + " " + token[2];
        
        if (token[0].toUpperCase() == "FORALL")
            result += " FORALL " + token[1]
        
        if (token[0].toUpperCase() == "EXIST")
            result += " EXIST " + token[1]
        
        if (token.toUpperCase() == "NOT")
            result += " NOT"
                
        if (token.toUpperCase() == "AND")
            result += " AND"

        if (token.toUpperCase() == "OR")
            result += " OR"

        if (token == "->")
            result += " ->"

        if (token == "<->")
            result += " <->"

        if (token === "(") 
            result += " (";
        
        if (token === ")") 
            result += " )";    
    }

    return result.substring(1, result.length);
}