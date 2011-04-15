RatPackJS
=========

Currently under development.

How to start the Ratpack for development
----------------------------------------

Create an optional .rvmrc file for RVM:

    echo "rvm --create ree@ratpackjs" > .rvmrc
    cd .
    (Press enter and then "y" to accept)
    
Install bundler

    gem install bundler

Install required gems using bundler

    bundle install
    
Start the application using rack

    rackup
  
Go to your browser and type in:

    http://localhost:9292/index.html
    
You should see "Hello World"

License
-------

RatPackJS is released under the MIT license.
