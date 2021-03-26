import React from "react";
import PropTypes from "prop-types";
import InputRpg from "../InputRpg/InputRpg";
import RoomManager from "../../managers/RoomManager";

export default class RenderTemplate extends React.Component {

    render() {
        return (
            this.manager_content(this.props.template)
        )
    }

    manager_content(content = [], replacer = false) {
        if (!Array.isArray(content))
            content = [content]
        return (
            content.map((cont, index) => {
                if (typeof cont === "object") {
                    if ("type" in cont) {
                        return this.call_type(cont, replacer, index)
                    } else if ("content" in cont) {
                        return this.manager_content(cont.content, replacer)
                    }
                }
                return this.replacer(cont, replacer)
            })
        )
    }

    call_type(cont, replacer, index) {
        let className = null
        let style = {}
        if (cont.class) {
            className = cont.class.toString().replaceAll(',', ' ')

            cont.class.forEach((value) => {
                if (value in this.props.css) {
                    for (const [k, v] of Object.entries(this.props.css[value])) {
                        style[k] = v
                    }
                }
            })
        }

        switch (cont.type) {
            case "div":
                return (
                    <div className={className} style={style} key={index}>
                        {this.manager_content(cont.content, replacer)}
                    </div>
                )
            case "span":
                return (
                    <span className={className} style={style} key={index}>
                        {this.manager_content(cont.content, replacer)}
                    </span>
                )
            case "input":
                let type = "", onChange = null, value = ""
                if (cont.reference in this.props.details) {
                    type = this.props.details[cont.reference].type
                }

                if (this.props.player_info[cont.reference] !== undefined){
                    value = this.props.player_info[cont.reference]
                }

                onChange = this.props.manager.changeInput()
                return (
                    <div key={index}>
                        <InputRpg type={type}
                                  value={value} onChange={onChange}
                                  reference={cont.reference}/>
                    </div>
                )
            case "list_object":
                return this.list_object_type(cont)
            default:
                return this.manager_content(cont.content, replacer)
        }
    }

    replacer(content, r) {
        if (!r) {
            r = (e) => {
                for (const [key, value] of Object.entries(this.props.player_info)) {
                    e = e.replaceAll(`#${key}#`, value.toString())
                }
                return e
            }
        }
        return r(content)
    }

    list_object_type(cont) {
        if (cont.from) {
            if (cont.from.toString() in this.props.objects)
                return this.props.objects[cont.from].map((k) => {
                    return (
                        <div className={'list-object'} key={k.key}>
                            {
                                this.manager_content(cont.content, (content) => {
                                    let aux = `${content}`
                                    for (const [key, value] of Object.entries(k)) {
                                        aux = aux.replaceAll(`#${key}#`, value.toString())
                                    }
                                    return aux
                                })
                            }
                        </div>
                    )
                })
        }
    }
}

RenderTemplate.propTypes = {
    objects: PropTypes.object.isRequired,
    template: PropTypes.object.isRequired,
    css: PropTypes.object.isRequired,
    player_info: PropTypes.array.isRequired,
    details: PropTypes.array.isRequired,
    manager: PropTypes.instanceOf(RoomManager)
}