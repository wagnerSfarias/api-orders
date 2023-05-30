
const express = require('express')
const uuid = require('uuid')
const cors = require('cors')
const port = 3001

const app = express()

app.use(express.json())
app.use(cors())

const orders = []

const checkId = (request, response, next) => {
    const { id } = request.params

    const index = orders.findIndex(order => order.id === id)

    if (index < 0) {
        return response.status(404).json({ error: 'Order not found' })
    }

    request.orderIndex = index
    request.userId = id
    next()
}

const about = (request, response, next) => {
    console.log(`URL buscada ${request.url},
     Método de requisição ${request.method}`)
    next()
}

app.get('/order', about, (request, response) => {

    return response.json(orders)
})

app.get('/order/:id', checkId, about, (request, response) => {
    const index = request.orderIndex
    return response.json(orders[index])
})


app.post('/order', about, (request, response) => {

    const { order, clienteName, price } = request.body

    const orderFirst = { id: uuid.v4(), order, clienteName, price, status: "em preparação" }
    orders.push(orderFirst)

    return response.json(orderFirst)
})

app.put('/order/:id', checkId, about, (request, response) => {
    const id = request.userId
    const index = request.orderIndex
    const { order, clienteName, price } = request.body

    const updateOrder = { id, order, clienteName, price, status: "em preparação" }

    orders[index] = updateOrder

    return response.json(updateOrder)

})

app.delete('/order/:id', checkId, about, (request, response) => {
    const index = request.orderIndex

    orders.splice(index, 1)
    return response.status(204).json()
})

app.patch('/order/:id', checkId, about, (request, response) => {

    const index = request.orderIndex

    orders[index].status = "pronto"

    return response.json(orders[index])
})

app.listen(port, () => {
    console.log("Servidor online !!!")
})
