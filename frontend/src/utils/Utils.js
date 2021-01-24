import React from "react";
import {object} from "prop-types";

export default class RenderTemplate extends React.Component {
    state = {
        "room": {
            "attr": {
                "name": "Teste"
            }
        },
        "template": [
            {
                "content": [
                    {
                        "type": "div",
                        "class": [
                            "center",
                            "w-100",
                            "red"
                        ],
                        "content": [
                            {
                                "type": "span",
                                "content": [
                                    "Teste"
                                ]
                            },
                            {
                                "type": "div",
                                "content": [
                                    {
                                        "type": "list_object",
                                        "from": "attr",
                                        "content": [
                                            {
                                                "type": "div",
                                                "content": [
                                                    "#name#"
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }

    render() {
        return (
            this.manager_content(this.state.template)
        )
    }

    manager_content(content = []) {
        return (
            content.map(cont => {
                if (typeof cont === "object") {
                    if ("type" in cont) {
                        switch (cont.type) {
                            case "div":
                                return this.div_type(cont)
                            case "span":
                                return this.span_type(cont)
                            case "list_object":
                                return this.list_object_type(cont)
                            default:
                                return this.manager_content(cont.content)
                        }
                    } else if ("content" in cont) {
                        return this.manager_content(cont.content)
                    }
                } else
                    return cont
            })
        )
    }

    div_type(cont) {
        let className = null
        if (cont.class)
            className = cont.class.toString().replaceAll(',', ' ')
        return (
            <div className={className}>
                {this.manager_content(cont.content)}
            </div>
        )
    }

    span_type(cont) {
        let className = null
        if (cont.class)
            className = cont.class.toString().replaceAll(',', ' ')
        return (
            <span className={className}>
            {this.manager_content(cont.content)}
        </span>
        )
    }

    list_object_type(cont) {
        if (cont.from) {
            if (cont.from.toString() in this.state.room)
                for (const [key, value] of Object.entries(this.state.room[cont.from])){
                    console.log(`Substituir #${key}# por ${value}`)
                    cont.content.forEach((obj, key) => {
                        console.log(obj.content.toString().replaceAll((`#${key}#`).toString(), value))
                    })
                }
        }
    }
}
