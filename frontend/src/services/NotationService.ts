export const NotationService = () => {
	
  const encodedToInfix = (infix: string): string => {
    var result = "";

    var tokens = infix.split(" ");
    for (let i = 0; i < tokens.length; i++) {
      var token = tokens[i];

      if (token === "FORM") {
        result += " " + tokens[i + 1] + "(" + tokens[i + 2] + ") ";
        i += 2;
      } else if (token === "FORALL") result += " ∀";
      else if (token === "EXIST") result += " ∃";
      else if (token === "NOT") result += " ¬ ";
      else if (token === "AND") result += " ∧ ";
      else if (token === "OR") result += " ∨ ";
      else if (token === "->") result += " ⇒ ";
      else if (token === "<->") result += " ⇔ ";
      else if (token === "(") result += " ( ";
      else if (token === ")") result += " ) ";
      else result += token + " ";
    }

    return result;
  };

  const infixToEncoded = (infix: string): string => {
    var result = "";

    var tokens = infix.substring(1, infix.length - 1).split("  ");
    for (let i = 0; i < tokens.length; i++) {
      var token = tokens[i];

      if (token[1] === "(") result += " FORM " + token[0] + " " + token[2];
      if (token[0] === "∀") result += " FORALL " + token[1];
      if (token[0] === "∃") result += " EXIST " + token[1];
      if (token === "¬") result += " NOT";
      if (token === "∧") result += " AND";
      if (token === "∨") result += " OR";
      if (token === "⇒") result += " ->";
      if (token === "⇔") result += " <->";
      if (token === "(") result += " (";
      if (token === ")") result += " )";
    }

    return result.substring(1, result.length);
  };

	return {
		encodedToInfix,
		infixToEncoded
	}
};
