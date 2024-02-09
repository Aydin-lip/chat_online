import yup from 'yup'

const msg = {
  ref_id_Required: 'ref_id is required!',
  type_Enum: 'type must be one of them text, file or voice!',
  type_Required: 'type is required!',
  path_Required: 'path is required!',
  name_Required: 'name is required!',
  description_Required: 'description is required!',
  size_Required: 'size is required!',
  time_Required: 'time is required!',
  text_Required: 'text is required!',
}

const typeRelation = (items, mess) => yup.string()
  .when('type', (type, schema) => {
    if (items.includes(type))
      schema.required(mess)
    return schema
  })

const AddNewMessageValidation = yup.object({
  ref_id: yup.string().required(msg.ref_id_Required),
  type: yup.mixed().oneOf(['text', 'file', 'voice'], msg.type_Enum).required(msg.type_Enum),
  path: typeRelation(['file', 'voice'], msg.path_Required),
  name: typeRelation(['file'], msg.name_Required),
  description: typeRelation(['file'], msg.description_Required),
  size: typeRelation(['file', 'voice'], msg.size_Required),
  time: typeRelation(['voice'], msg.time_Required),
  text: typeRelation(['text'], msg.text_Required)
})


export {
  AddNewMessageValidation
}