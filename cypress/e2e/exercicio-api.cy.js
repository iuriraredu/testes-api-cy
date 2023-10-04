import contrato from '../contracts/usuarios.contract'
import {faker} from '@faker-js/faker';

describe('Testes da Funcionalidade Usuários', () => {

     it('Deve validar contrato de usuários', () => {
          cy.request('usuarios').then(response => {
               return contrato.validateAsync(response.body);
          });
     });

     it('Deve listar usuários cadastrados', () => {
          cy.request('usuarios').then((response) => {
               expect(response.status).to.equal(200)
               expect(response.body).to.have.property('usuarios')
               expect(response.duration).to.be.lessThan(20)
          })
     });

     let email = faker.internet.email();

     it('Deve cadastrar um usuário com sucesso', () => {
          cy.cadastrarUsuario(
               faker.person.fullName(), email, faker.internet.password(), "true"
          ).then((response) => {
               expect(response.status).to.equal(201)
               expect(response.body.message).to.equal('Cadastro realizado com sucesso')
          });
     });

     it('Deve validar um usuário com email inválido', () => {
          cy.cadastrarUsuario(
               faker.person.fullName(), email, faker.internet.password(), "true"
          ).then((response) => {
               expect(response.status).to.equal(400);
               expect(response.body.message).to.equal('Este email já está sendo usado');
          });
     });

     it('Deve editar um usuário previamente cadastrado', () => {
          cy.cadastrarUsuario(
               faker.person.fullName(), faker.internet.email(), faker.internet.password(), "false"
          ).then((response) => {
               cy.request({
                    method: 'PUT',
                    url: `usuarios/${response.body._id}`,
                    body: {
                         "nome": faker.person.fullName(),
                         "email": faker.internet.email(),
                         "password": faker.internet.password(),
                         "administrador": "true"
                    }
               }).then(response => {
                    expect(response.status).to.equal(200);
                    expect(response.body.message).to.equal('Registro alterado com sucesso');
               });
          });
     });

     it('Deve deletar um usuário previamente cadastrado', () => {
          cy.cadastrarUsuario(
               faker.person.fullName(), faker.internet.email(), faker.internet.password(), "false"
          ).then((response) => {
               cy.request({
                    method: 'DELETE',
                    url: `usuarios/${response.body._id}`,
               }).then(response => {
                    expect(response.status).to.equal(200);
                    expect(response.body.message).to.equal('Registro excluído com sucesso');
               });
          });

     });
});
