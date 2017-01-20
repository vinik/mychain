# -*- mode: ruby -*-
# vi: set ft=ruby :

# file all glove ride network fence trap copper tongue utility crater cotton

ENV['VAGRANT_DEFAULT_PROVIDER'] = 'docker'

VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|

    config.vm.define "openchain_server" do |server|
        server.vm.provider "docker" do |docker|
            docker.name = "openchain2"
            docker.image = "openchain_openchain:latest"
            docker.pull = false

            docker.ports = [ "9097:8080" ]
            docker.expose = [ 8080 ]
            docker.remains_running = true

            docker.volumes = [
                Dir.pwd + "/openchain:/openchain/data"
            ]

        end
    end

    config.vm.define "db" do |db|
        db.vm.provider "docker" do |docker|
            docker.name = "db"
            docker.image = "mysql"
            docker.pull = true
            docker.ports = [ "33067:3306" ]
            docker.expose = [ 3306 ]
            docker.env = {
                :MYSQL_ROOT_PASSWORD => "password"
            }
            docker.remains_running = true
            docker.has_ssh = false
        end
    end

    config.vm.define "api" do |api|
        api.vm.provider "docker" do |docker|
            docker.name = "api"
            docker.image = "node:4"
            docker.ports = [ "9091:8080" ]
            docker.expose = [ 8080 ]
            docker.remains_running = true
            docker.volumes = [
                Dir.pwd + "/api:/src"
            ]
            docker.create_args = [
                "-w", "/src"
            ]
            docker.cmd = [
                "node_modules/.bin/coffee",
                "server.coffee"
            ]
            docker.env = {
                :AUTH0_DOMAIN => "foo",
                :AUTH0_CLIENT_ID => "bar",
                :AUTH0_CLIENT_SECRET => "baz",
                :AUTH0_CALLBACK_URL => "http://localhost:3000/callback"
            }
            docker.link 'openchain2:openchain-server'
            docker.link 'db:db'
        end
    end

    config.vm.define "web" do |web|
        web.vm.provider "docker" do |docker|
            docker.name = "web"
            docker.image = "httpd"
            docker.ports = [ "9092:80" ]
            docker.expose = [ 80 ]
            docker.remains_running = true
            docker.volumes = [
                Dir.pwd + "/web/:/usr/local/apache2/htdocs/"
            ]
            docker.link 'api:api'
        end
    end

    config.vm.define "old_wallet" do |old_wallet|
        old_wallet.vm.provider "docker" do |docker|
            docker.name = "oldwallet"
            docker.image = "httpd"
            docker.ports = [ "9093:80" ]
            docker.expose = [ 80 ]
            docker.remains_running = true
            docker.volumes = [
                Dir.pwd + "/../openchain-wallet/www/:/usr/local/apache2/htdocs/"
            ]
            docker.link 'openchain2:openchain2'
        end
    end


end
