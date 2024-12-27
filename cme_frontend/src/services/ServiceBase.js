/**
Interface para padronizar os serviços.
Cada serviço deve implementar os métodos add, detail, edit e delete.
 */
class ServiceBase {
    get() {
        throw new Error("Método 'get' deve ser implementado");
    }
    getById(id) {
        throw new Error("Método 'getById' deve ser implementado");
    }
    add(payload) {
      throw new Error("Método 'add' deve ser implementado");
    }
  
    detail(id) {
      throw new Error("Método 'detail' deve ser implementado");
    }
  
    edit(id, payload) {
      throw new Error("Método 'edit' deve ser implementado");
    }
  
    delete(id) {
      throw new Error("Método 'delete' deve ser implementado");
    }
  }
  
  export default ServiceBase;
  