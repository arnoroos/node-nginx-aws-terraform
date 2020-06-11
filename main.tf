
provider "aws" {
  region = var.aws_region
}

provider "docker" {
  host = "tcp://${aws_instance.NodeJSApp.private_ip}:2376/"
}


resource "aws_security_group" "allow_web" {
  name        = "allow_http"
  description = "Allow http and ssh inbound traffic"
  vpc_id      = var.vpc_id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_key_pair" "auth" {
  key_name   = var.key_name
  public_key = file(var.public_key_path)
}

resource "aws_instance" "NodeJSApp" {
  ami                         = var.aws_ami
  instance_type               = var.aws_type
  associate_public_ip_address = true
  vpc_security_group_ids      = [var.security_group1]
  key_name                    = aws_key_pair.auth.id
  subnet_id                   = var.subnet
  iam_instance_profile        = var.iam_ec2_role


  tags = {
    Name    = "NodeJSApp"
    Product = "Docker Nginx and Node"
  }

  provisioner "file" {
    source      = "./nginx"
    destination = "/home/ec2-user/nginx"
    connection {
      host        = self.private_ip
      type        = "ssh"
      user        = "ec2-user"
      private_key = file(var.private_key_path)
    }
  }

  provisioner "file" {
    source      = "docker-compose.yml"
    destination = "/home/ec2-user/docker-compose.yml"
    connection {
      host        = self.private_ip
      type        = "ssh"
      user        = "ec2-user"
      private_key = file(var.private_key_path)
    }
  }

  provisioner "remote-exec" {
    inline = [
      "sudo yum -y update",
      "sudo yum -y install git",
      "sudo git clone https://arnoroos:r0sdel413!@bitbucket.org/dttawsassetteam/dig-js-customercommons-asset.git /home/ec2-user/dig-js-customercommons-asset",
      "sudo yum -y install docker",
      "sudo service docker restart",
      "sudo curl -L https://github.com/docker/compose/releases/download/1.15.0/docker-compose-`uname -s`-`uname -m` > docker-compose",
      "sudo mv docker-compose /usr/local/bin/docker-compose",
      # "sudo chmod +x /usr/local/bin/docker-compose",
      # "sudo /usr/local/bin/docker-compose up -d --scale web=2",
    ]
    connection {
      host        = self.private_ip
      type        = "ssh"
      user        = "ec2-user"
      private_key = file(var.private_key_path)
    }
  }
}
