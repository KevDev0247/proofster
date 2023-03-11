export function encodedToInfix(infix: string): string {
    var result = "";

    var tokens = infix.split(" ");
    for (let i = 0; i < tokens.length; i++) {
        var token = tokens[i];

        if (token === "FORM") {
            result += " " + tokens[i + 1] + "(" + tokens[i + 2] + ") ";
            i += 2;
        }

        else if (token === "FORALL") 
            result += " ∀";

        else if (token === "EXIST") 
            result += " ∃";

        else if (token === "NOT") 
            result += " ¬ ";

        else if (token === "AND") 
            result += " ∧ ";

        else if (token === "OR")  
            result += " ∨ ";

        else if (token === "->") 
            result += " ⇒ ";

        else if (token === "<->") 
            result += " ⇔ ";

        else if (token === "(") 
            result += " ( ";
        
        else if (token === ")") 
            result += " ) ";    
            
        else 
            result += token + " ";
    }

    return result;
}