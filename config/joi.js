const joi = require("joi");
const moment = require("moment");
const maxNum = (moment().year() - 1911) * 1000 + 999;
const RE = {
  name: /^[^\s]{2,30}$/,
  gender: /^(男|女)$/,
  id: /^[A-Z][1-2]\d{8}$/,
  agent_id: /^[^\s]{3,30}$/,
  date: /^[01][0-9]{2}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])$/,
  job_category: /^(01|02|03|04|05|06|99)$/,
  education: /^(01|02|03|05|07|99)$/,
  bit: /^(0|1)$/,
  status: /^(Y|N|D)$/,
  status2: /^(Y|N)$/,
  time: /^(?:[0-9]|[01][0-9]|2[0-3])(?:[0-5][0-9])$/,
};
module.exports = {
  newAgent(data) {
    const schema = joi.object({
      id: joi.string().regex(RE.agent_id).trim().required(),
      name: joi.string().regex(RE.name).trim().required(),
      auth_id: joi.array().items(joi.string()).default([]),
    });
    return schema.validate(data);
  },
  editAgent(data) {
    const schema = joi.object({
      id: joi.string().regex(RE.agent_id).trim().required(),
      name: joi.string().regex(RE.name).trim().required(),
      status: joi.string().regex(RE.status2).required(),
      password: joi.string().allow(""),
    });
    return schema.validate(data);
  },
  editAgentAuth(data) {
    const schema = joi.object({
      id: joi.string().trim().required(),
      add_auth_id: joi.array().items(joi.string()).default([]),
      rm_auth_id: joi.array().items(joi.string()).default([]),
    }).or('add_auth_id', 'rm_auth_id');
    return schema.validate(data);
  },
  editPassword(data) {
    const schema = joi.object({
      old_pw: joi.string().regex(RE.agent_id).trim().required(),
      new_pw: joi.string().regex(RE.agent_id).trim().required(),
    });
    return schema.validate(data);
  },
  volId(data) {
    const schema = joi.object({
      name: joi.string().regex(RE.name).trim().required(),
      gender: joi.string().valid("男", "女").required(),
      id_num: joi.string().regex(RE.id).required(),
      birthday: joi.string().regex(RE.date).required(),
    });
    return schema.validate(data);
  },
  newVol(data) {
    const schema = joi.object({
      name: joi.string().regex(RE.name).trim().required(),
      gender: joi.string().regex(RE.gender).required(),
      id_num: joi.string().regex(RE.id).required(),
      birthday: joi.string().regex(RE.date).required(),
      vol_id: joi.string().required(),
      job_category: joi.string().regex(RE.job_category).required(),
      job: joi.string().max(30).trim().allow(""),
      education: joi.string().regex(RE.education).required(),
      school: joi.string().max(30).trim().allow(""),
      has_book: joi.number().integer().valid(0, 1).required(),
      issue_date: joi.string().regex(RE.date).allow(""),
      tel: joi.string().max(20).trim().allow(""),
      mobile: joi.string().max(20).trim().allow(""),
      address: joi.string().max(30).trim().allow(""),
      note: joi.string().max(85).trim().allow(""),
      status: joi.string().regex(RE.status).required(),
      join_date: joi.string().regex(RE.date).required(),
      quit_date: joi.string().regex(RE.date).allow(""),
      book_pic: joi.string().max(100).allow(""),
      id_photo: joi.string().max(100).allow(""),
      group_id: joi.array().items(joi.string()).default([]),
      leader: joi.array().items(joi.string()).default([]),
      vice: joi.array().items(joi.string()).default([]),
    });
    return schema.validate(data);
  },
  editPage(data) {
    const schema = joi.number().max(maxNum);
    return schema.validate(data);
  },
  editVol(data) {
    const schema = joi.object({
      vol_id: joi.number().max(maxNum),
      name: joi.string().regex(RE.name).trim().optional(),
      gender: joi.string().regex(RE.gender).optional(),
      id_num: joi.string().regex(RE.id).optional(),
      birthday: joi.string().regex(RE.date).optional(),
      job_category: joi.string().regex(RE.job_category).optional(),
      job: joi.string().max(30).trim().allow("").optional(),
      education: joi.string().regex(RE.education).optional(),
      school: joi.string().max(30).trim().allow("").optional(),
      has_book: joi.number().integer().valid(0, 1).optional(),
      issue_date: joi.string().regex(RE.date).allow("").optional(),
      tel: joi.string().max(20).trim().allow("").optional(),
      mobile: joi.string().max(20).trim().allow("").optional(),
      address: joi.string().max(30).trim().allow("").optional(),
      note: joi.string().max(85).trim().allow("").optional(),
      status: joi.string().regex(RE.status).optional(),
      join_date: joi.string().regex(RE.date).optional(),
      quit_date: joi.string().regex(RE.date).allow("").optional(),
      book_Pic: joi.string().max(100).allow("").optional(),
      id_photo: joi.string().max(100).allow("").optional(),
      addGroupId: joi.array().items(joi.string()).default([]),
      addLeader: joi.array().items(joi.string()).default([]),
      addVice: joi.array().items(joi.string()).default([]),
      rmGroupId: joi.array().items(joi.string()).default([]),
      rmLeader: joi.array().items(joi.string()).default([]),
      rmVice: joi.array().items(joi.string()).default([]),
    });
    return schema.validate(data);
  },
  newCriteria(data) {
    const schema = joi.object({
      name: joi.string().max(20).required(),
      group_id: joi.string().required(),
      subgroup: joi.string().allow(""),
      start_time: joi.string().regex(RE.time).required(),
      end_time: joi.string().regex(RE.time).required(),
    });
    return schema.validate(data);
  },
  editCriteria(data) {
    const schema = joi.object({
      id: joi.string().required(),
      name: joi.string().max(20).required(),
      start_time: joi.string().regex(RE.time).required(),
      end_time: joi.string().regex(RE.time).required(),
      is_active: joi.string().regex(RE.status2).required(),
    });
    return schema.validate(data);
  },
  batchEdit(data) {
    const schema = joi.object({
      ids: joi.array().items(joi.number()).required(),
      hours: joi.number().min(0).multiple(0.5).required(),
      note: joi.string().allow(""),
    });
    return schema.validate(data);
  },
  manualEdit(data) {
    const schema = joi.array().items(
      joi.object({
        id: joi.number().required(),
        hours: joi.number().min(0).multiple(0.5).required(),
        note: joi.string().allow(""),
      })
    );
    return schema.validate(data);
  },
};
