premise_input = {
    "formula_type": 1,
    "inside": {
        "formula_type": 1,
        "inside": {
            "formula_type": 2,
            "left": {
                "formula_type": 2,
                "left": {
                    "formula_type": 3,
                    "func_name": "F",
                    "inside": {
                        "formula_type": 3,
                        "func_name": "f",
                        "inside": {
                            "formula_type": 4,
                            "var_name": "x1",
                            "var_count": {},
                            "quant_list": []
                        },
                        "negation": False,
                        "assigned": True,
                        "var_count": {},
                        "quant_list": []
                    },
                    "negation": False,
                    "assigned": True,
                    "var_count": {
                        "y": 2,
                        "x": 2
                    },
                    "quant_list": []
                },
                "right": {
                    "formula_type": 3,
                    "func_name": "G",
                    "inside": {
                        "formula_type": 3,
                        "func_name": "f",
                        "inside": {
                            "formula_type": 4,
                            "var_name": "x1",
                            "var_count": {},
                            "quant_list": []
                        },
                        "negation": False,
                        "assigned": True,
                        "var_count": {},
                        "quant_list": []
                    },
                    "negation": False,
                    "assigned": True,
                    "var_count": {
                        "y": 2,
                        "x": 2
                    },
                    "quant_list": []
                },
                "connective": 3,
                "is_clause": False,
                "var_count": {
                    "y": 2,
                    "x": 2
                },
                "quant_list": []
            },
            "right": {
                "formula_type": 1,
                "inside": {
                    "formula_type": 2,
                    "left": {
                        "formula_type": 1,
                        "inside": {
                            "formula_type": 3,
                            "func_name": "F",
                            "inside": {
                                "formula_type": 4,
                                "var_name": "x1",
                                "var_count": {
                                    "y": 2,
                                    "x": 2
                                },
                                "quant_list": []
                            },
                            "negation": False,
                            "assigned": True,
                            "var_count": {
                                "y": 2,
                                "x": 2
                            },
                            "quant_list": []
                        },
                        "quantifier": 3,
                        "negation": False,
                        "quant_var": "",
                        "var_count": {
                            "y": 2,
                            "x": 2
                        },
                        "quant_list": []
                    },
                    "right": {
                        "formula_type": 1,
                        "inside": {
                            "formula_type": 3,
                            "func_name": "G",
                            "inside": {
                                "formula_type": 4,
                                "var_name": "x1",
                                "var_count": {
                                    "y": 2,
                                    "x": 2
                                },
                                "quant_list": []
                            },
                            "negation": False,
                            "assigned": True,
                            "var_count": {
                                "y": 2,
                                "x": 2
                            },
                            "quant_list": []
                        },
                        "quantifier": 3,
                        "negation": True,
                        "quant_var": "",
                        "var_count": {
                            "y": 2,
                            "x": 2
                        },
                        "quant_list": []
                    },
                    "connective": 3,
                    "is_clause": False,
                    "var_count": {
                        "y": 2,
                        "x": 2
                    },
                    "quant_list": []
                },
                "quantifier": 3,
                "negation": False,
                "quant_var": "",
                "var_count": {
                    "y": 2,
                    "x": 2
                },
                "quant_list": []
            },
            "connective": 4,
            "is_clause": False,
            "var_count": {
                "y": 2,
                "x": 2
            },
            "quant_list": []
        },
        "quantifier": 3,
        "negation": False,
        "quant_var": "y1",
        "var_count": {
            "y": 2,
            "x": 2
        },
        "quant_list": []
    },
    "quantifier": 3,
    "negation": False,
    "quant_var": "x1",
    "var_count": {
        "y": 2,
        "x": 2
    },
    "quant_list": [
        [
            2,
            "x1"
        ]
    ]
}

event_input = {
  "body": "{\"argument_json\": [{\"formula_type\": 1, \"inside\": {\"formula_type\": 1, \"inside\": {\"formula_type\": 2, \"left\": {\"formula_type\": 2, \"left\": {\"formula_type\": 3, \"func_name\": \"F\", \"inside\": {\"formula_type\": 3, \"func_name\": \"f\", \"inside\": {\"formula_type\": 4, \"var_name\": \"x1\", \"var_count\": {}, \"quant_list\": []}, \"negation\": false, \"assigned\": true, \"var_count\": {}, \"quant_list\": []}, \"negation\": false, \"assigned\": true, \"var_count\": {\"y\": 2, \"x\": 2}, \"quant_list\": []}, \"right\": {\"formula_type\": 3, \"func_name\": \"G\", \"inside\": {\"formula_type\": 3, \"func_name\": \"f\", \"inside\": {\"formula_type\": 4, \"var_name\": \"x1\", \"var_count\": {}, \"quant_list\": []}, \"negation\": false, \"assigned\": true, \"var_count\": {}, \"quant_list\": []}, \"negation\": false, \"assigned\": true, \"var_count\": {\"y\": 2, \"x\": 2}, \"quant_list\": []}, \"connective\": 3, \"is_clause\": false, \"var_count\": {\"y\": 2, \"x\": 2}, \"quant_list\": []}, \"right\": {\"formula_type\": 1, \"inside\": {\"formula_type\": 2, \"left\": {\"formula_type\": 1, \"inside\": {\"formula_type\": 3, \"func_name\": \"F\", \"inside\": {\"formula_type\": 4, \"var_name\": \"x1\", \"var_count\": {\"y\": 2, \"x\": 2}, \"quant_list\": []}, \"negation\": false, \"assigned\": true, \"var_count\": {\"y\": 2, \"x\": 2}, \"quant_list\": []}, \"quantifier\": 3, \"negation\": false, \"quant_var\": \"\", \"var_count\": {\"y\": 2, \"x\": 2}, \"quant_list\": []}, \"right\": {\"formula_type\": 1, \"inside\": {\"formula_type\": 3, \"func_name\": \"G\", \"inside\": {\"formula_type\": 4, \"var_name\": \"x1\", \"var_count\": {\"y\": 2, \"x\": 2}, \"quant_list\": []}, \"negation\": false, \"assigned\": true, \"var_count\": {\"y\": 2, \"x\": 2}, \"quant_list\": []}, \"quantifier\": 3, \"negation\": true, \"quant_var\": \"\", \"var_count\": {\"y\": 2, \"x\": 2}, \"quant_list\": []}, \"connective\": 3, \"is_clause\": false, \"var_count\": {\"y\": 2, \"x\": 2}, \"quant_list\": []}, \"quantifier\": 3, \"negation\": false, \"quant_var\": \"\", \"var_count\": {\"y\": 2, \"x\": 2}, \"quant_list\": []}, \"connective\": 4, \"is_clause\": false, \"var_count\": {\"y\": 2, \"x\": 2}, \"quant_list\": []}, \"quantifier\": 3, \"negation\": false, \"quant_var\": \"y1\", \"var_count\": {\"y\": 2, \"x\": 2}, \"quant_list\": []}, \"quantifier\": 3, \"negation\": false, \"quant_var\": \"x1\", \"var_count\": {\"y\": 2, \"x\": 2}, \"quant_list\": [[2, \"x1\"]]}]}"
}
