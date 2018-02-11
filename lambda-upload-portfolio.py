import boto3
from botocore.client import Config
import StringIO
import zipfile
import mimetypes

def lambda_handler(event, context):
    job = event.get("CodePipeline.job")
    message = ""
    location = {
        "bucketName": "build.portfolio.bradcwilliams.com",
        "objectKey": "portfoliobuild.zip"
    }
    try:
        s3 = boto3.resource('s3', config=Config(signature_version='s3v4'))
        portfolio_bucket = s3.Bucket('portfolio.bradcwilliams.com')
        portfolio_zip = StringIO.StringIO()

        if job:
            message += "Recieving job %s from CodePipeline\n" % (job['id'])
            for artifact in job['data']['inputArtifacts']:
                if artifact['name'] == 'MyAppBuild':
                    location = artifact['location']['s3Location']
        build_bucket = s3.Bucket(location['bucketName'])
        message += "Building %s from %s\n" % (location['objectKey'], location['bucketName'])
        message += "Downloading %s\n" % (location['objectKey'])
        build_bucket.download_fileobj(location['objectKey'], portfolio_zip)
        message += "Unzipping %s\n" % (location['objectKey'])
        with zipfile.ZipFile(portfolio_zip) as pzip:
            for filename in pzip.namelist():
                obj = pzip.open(filename)
                message += "Uploading %s to %s\n" % (filename, portfolio_bucket)
                portfolio_bucket.upload_fileobj(obj,filename,
                    ExtraArgs={'ContentType': mimetypes.guess_type(filename)[0]})
                portfolio_bucket.Object(filename).Acl().put(ACL='public-read')
        message += "Done uploading files\n"
        if job:
            message += "Notifying codepipeline of success\n"
            codepipeline = boto3.client('codepipeline')
            codepipeline.put_job_success_result(jobId=job['id'])
        message += "Deployment successful\n"
        send_notification('arn:aws:sns:us-east-1:092288055581:PortfolioNotify', 'Successful portfolio.bradcwilliams.com Deployment', message)
        print message
    except:
        if job:
            message += "Notifying codepipeline of failure\n"
            codepipeline = boto3.client('codepipeline')
            codepipeline.put_job_failure_result(jobId=job['id'], failureDetails={'type':'JobFailed','message': message})
        message += "Deployment failed\n"
        send_notification('arn:aws:sns:us-east-1:092288055581:PortfolioNotify', 'Failed portfolio.bradcwilliams.com Deployment', message)
        print message
        raise

def send_notification(topic, subject, message):
    sns = boto3.resource('sns')
    topic = sns.Topic(topic)

    topic.publish(Subject=subject, Message=message)
