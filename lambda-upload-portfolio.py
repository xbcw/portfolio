import boto3
from botocore.client import Config
import StringIO
import zipfile
import mimetypes

def lambda_handler(event, context):
    s3 = boto3.resource('s3', config=Config(signature_version='s3v4'))
    portfolio_bucket = s3.Bucket('portfolio.bradcwilliams.com')
    build_bucket = s3.Bucket('build.portfolio.bradcwilliams.com')
    portfolio_zip = StringIO.StringIO()

    build_bucket.download_fileobj('portfoliobuild.zip', portfolio_zip)
    with zipfile.ZipFile(portfolio_zip) as pzip:
        for filename in pzip.namelist():
            obj = pzip.open(filename)
            portfolio_bucket.upload_fileobj(obj,filename,
                ExtraArgs={'ContentType': mimetypes.guess_type(filename)[0]})
            portfolio_bucket.Object(filename).Acl().put(ACL='public-read')
