import express from 'express'
import { promises } from 'fs'

const router = express.Router()

const { readFile, writeFile } = promises

router.get('/', async (request, response) => {
  try {
    logger.info('GET /grades')

    logger.info('GET /grades - reading database started')
    const gradesDATA = await readFile(global.gradesFileName, 'utf8')
    logger.info('GET /grades - reading database finished')

    const gradesJSON = JSON.parse(gradesDATA)

    delete gradesJSON.nextId

    logger.info('GET /grades successful')

    response.json(gradesJSON)
  } catch (err) {
    response.json({ error: err.message })
  }
})

router.post('/', async (request, response) => {
  try {
    const { student, subject, type, value } = request.body

    logger.info(`POST /grades - Payload { student: ${student}, subject: ${subject}, type: ${type}, value: ${value} }`)

    logger.info('POST /grades - reading database started')
    const gradesDATA = await readFile(global.gradesFileName, 'utf8')
    logger.info('POST /grades - reading database finished')

    const gradesJSON = JSON.parse(gradesDATA)

    const grade = {
      id: gradesJSON.nextId,
      student,
      subject,
      type,
      value,
      timestamp: new Date().toISOString()
    }

    gradesJSON.nextId++
    gradesJSON.grades.push(grade)

    logger.info('POST /grades - persistence started')
    await writeFile(global.gradesFileName, JSON.stringify(gradesJSON))
    logger.info('POST /grades - persistence finished')

    logger.info('POST /grades successful')
    response.json(grade)
  } catch (err) {
    logger.error(err)
    response.status(400).json({ error: err.message })
  }
})

router.put('/', async (request, response) => {
  try {
    logger.info('PUT /grades')
    const { id, student, subject, type, value } = request.body

    logger.info(`PUT /grades - Payload { id: ${id}, student: ${student}, subject: ${subject}, type: ${type}, value: ${value} }`)

    logger.info('PUT /grades - reading database started')
    const gradesDATA = await readFile(global.gradesFileName, 'utf8')
    logger.info('PUT /grades - reading database finished')

    const gradesJSON = JSON.parse(gradesDATA)

    const grade = {
      id,
      student,
      subject,
      type,
      value,
      timestamp: new Date().toISOString()
    }
    const gradesUpdated = gradesJSON.grades.map(g => {
      if (g.id === grade.id) {
        return grade
      }
      return g
    })

    gradesJSON.grades = gradesUpdated

    logger.info('PUT /grades - persistence started')
    await writeFile(global.gradesFileName, JSON.stringify(gradesJSON))
    logger.info('PUT /grades - persistence finished')

    logger.info('PUT /grades successful')
    response.json(grade)
  } catch (err) {
    logger.error(err)
    response.status(400).json({ error: err.message })
  }
})

router.delete('/:gradeId', async (request, response) => {
  try {
    const { gradeId } = request.params

    logger.info(`DELETE /grades/${gradeId}`)

    logger.info(`DELETE /grades/${gradeId} - reading database started`)
    const gradesDATA = await readFile(global.gradesFileName, 'utf8')
    logger.info(`DELETE /grades/${gradeId} - reading database finished`)

    const gradesJSON = JSON.parse(gradesDATA)

    const gradesUpdated = gradesJSON.grades.filter(g => g.id !== parseInt(gradeId))

    gradesJSON.grades = gradesUpdated

    logger.info(`DELETE /grades/${gradeId} - persistence started`)
    await writeFile(global.gradesFileName, JSON.stringify(gradesJSON))
    logger.info(`DELETE /grades/${gradeId} - persistence finished`)

    logger.info(`DELETE /grades/${gradeId} successful`)

    response.json({ message: `grade ${gradeId} deleted.` })
  } catch (err) {
    logger.error(err)
    response.status(400).json({ error: err.message })
  }
})

router.get('/:gradeId', async (request, response) => {
  try {
    const { gradeId } = request.params

    logger.info(`GET /grades/${gradeId}`)

    logger.info(`GET /grades/${gradeId} - reading database started`)
    const gradesDATA = await readFile(global.gradesFileName, 'utf8')
    logger.info(`GET /grades/${gradeId} - reading database finished`)

    const gradesJSON = JSON.parse(gradesDATA)

    const grade = gradesJSON.grades.find(g => g.id === parseInt(gradeId))

    if (!grade) {
      throw Error('Grade not found')
    }

    logger.info(`GET /grades/${gradeId} successful`)
    response.json(grade)
  } catch (err) {
    logger.error(err)
    response.status(400).json({ error: err.message })
  }
})

router.post('/notes-by-student-and-subject', async (request, response) => {
  try {
    logger.info('POST /grades/notes-by-student-and-subject')
    const { student, subject } = request.body

    logger.info(`POST /grades/notes-by-student-and-subject - Payload { student: ${student}, subject: ${subject}`)

    logger.info('POST /grades/notes-by-student-and-subject - reading database started')
    const gradesDATA = await readFile(global.gradesFileName, 'utf8')
    logger.info('POST /grades/notes-by-student-and-subject - reading database finished')

    const gradesJSON = JSON.parse(gradesDATA)

    const totalNote = gradesJSON
      .grades
      .filter(g => g.student === student && g.subject === subject)
      .reduce((acc, g) => acc + g.value, 0)

    logger.info('POST /grades/notes-by-student-and-subject successful')
    response.json({ student, subject, total_value: totalNote })
  } catch (err) {
    logger.error(err)
    response.status(400).json({ error: err.message })
  }
})

router.post('/notes-by-student-and-subject', async (request, response) => {
  try {
    logger.info('POST /grades/notes-by-student-and-subject')
    const { student, subject } = request.body

    logger.info(`POST /grades/notes-by-student-and-subject - Payload { student: ${student}, subject: ${subject}`)

    logger.info('POST /grades/notes-by-student-and-subject - reading database started')
    const gradesDATA = await readFile(global.gradesFileName, 'utf8')
    logger.info('POST /grades/notes-by-student-and-subject - reading database finished')

    const gradesJSON = JSON.parse(gradesDATA)

    const totalNote = gradesJSON
      .grades
      .filter(g => g.student === student && g.subject === subject)
      .reduce((acc, g) => acc + g.value, 0)

    logger.info('POST /grades/notes-by-student-and-subject successful')
    response.json({ student, subject, total_value: totalNote })
  } catch (err) {
    logger.error(err)
    response.status(400).json({ error: err.message })
  }
})

router.post('/grade-avg-by-type-and-subject', async (request, response) => {
  try {
    logger.info('POST /grades/grade-avg-by-type-and-subject')
    const { type, subject } = request.body

    logger.info(`POST /grades/grade-avg-by-type-and-subject - Payload { type: ${type}, subject: ${subject}`)

    logger.info('POST /grades/grade-avg-by-type-and-subject - reading database started')
    const gradesDATA = await readFile(global.gradesFileName, 'utf8')
    logger.info('POST /grades/grade-avg-by-type-and-subject - reading database finished')

    const gradesJSON = JSON.parse(gradesDATA)

    const totalNoteJson = gradesJSON
      .grades
      .filter(g => g.type.toLowerCase() === type.toLowerCase() && g.subject.toLowerCase() === subject.toLowerCase())
    logger.info(`POST /grades/grade-avg-by-type-and-subject - total grades founded ${totalNoteJson.length}`)

    const totalNote = totalNoteJson.reduce((acc, g) => acc + g.value, 0)
    logger.info(`POST /grades/grade-avg-by-type-and-subject - total notes reduced ${totalNote}`)

    logger.info('POST /grades/grade-avg-by-type-and-subject successful')
    response.json({ type, subject, avg_value: totalNote / totalNoteJson.length })
  } catch (err) {
    logger.error(err)
    response.status(400).json({ error: err.message })
  }
})

router.post('/top3', async (request, response) => {
  try {
    logger.info('POST /grades/top3')
    const { type, subject } = request.body

    logger.info(`POST /grades/top3 - Payload { type: ${type}, subject: ${subject}`)

    logger.info('POST /grades/top3 - reading database started')
    const gradesDATA = await readFile(global.gradesFileName, 'utf8')
    logger.info('POST /grades/top3 - reading database finished')

    const gradesJSON = JSON.parse(gradesDATA)

    const top3 = gradesJSON
      .grades
      .filter(g => g.type === type && g.subject === subject)
      .sort((a, b) => b.value - a.value)
      .splice(0, 3)

    logger.info('POST /grades/top3 successful')
    response.json(top3)
  } catch (err) {
    logger.error(err)
    response.status(400).json({ error: err.message })
  }
})

export default router
