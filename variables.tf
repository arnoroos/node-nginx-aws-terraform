variable "public_key_path" {
  description = "Path to the SSH public key to be used for authentication."
  default = "/c:/Users/Administrator/.ssh/ddpm_keypair_arno.pub"
}

variable "private_key_path" {
  description = "Path to the SSH private key to be used for authentication."
  default = "/c:/Users/Administrator/.ssh/ddpm_keypair_arno.pem"
}

variable "key_name" {
  description = "Desired name of AWS key pair."
  default = "ddpm_keypair_arno"
}

variable "aws_region" {
  description = "AWS region to launch servers."
  default     = "ap-southeast-2"
}

variable "aws_ami" {
  description = "Amazon Machine Images."
  default = "ami-03686c686b463366b"
}

variable "aws_type" {
  description = "Amazon Machine Images."
  default = "t2.micro"
}

variable "subnet" {
  description = "Public southeast-2a"
  default = "subnet-e6674d82"
}

variable "vpc_id" {
  description = "VPC ID"
  default = "vpc-dffb96bb"
}

variable security_group1 {
  description = "Security Groups"
  default = "sg-45f6f322"
}
variable iam_ec2_role {
  description = "EC2 IAM Role"
  default = "DDPMNodeJSRole"
}