import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type DocumentMetadata = {
  name: string;
  type: string;
  size: string;
  lastModified: string;
};

export default function DocumentSigningView() {
  const [currentStep, setCurrentStep] = useState<'upload' | 'review' | 'sign' | 'share'>('upload');
  const [documentMetadata, setDocumentMetadata] = useState<DocumentMetadata | null>(null);

  const handleUpload = () => {
    // Simulating document upload and metadata extraction
    setDocumentMetadata({
      name: 'Contract_2023.pdf',
      type: 'application/pdf',
      size: '2.5 MB',
      lastModified: '2023-05-15 14:30:00',
    });
    setCurrentStep('review');
  };

  const handleSign = () => {
    setCurrentStep('sign');
  };

  const handleFinishSigning = () => {
    setCurrentStep('share');
  };

  const handleShare = () => {
    // Placeholder for sharing logic
    alert('Sharing document...');
  };

  const handleDownload = () => {
    // Placeholder for download logic
    alert('Downloading document...');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'upload':
        return (
          <View style={styles.stepContainer}>
            <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
              <Ionicons name="cloud-upload-outline" size={48} color="#007AFF" />
              <Text style={styles.uploadText}>Upload Document</Text>
            </TouchableOpacity>
          </View>
        );
      case 'review':
        return (
          <ScrollView style={styles.scrollView}>
            <View style={styles.stepContainer}>
              <Text style={styles.sectionTitle}>Document Metadata</Text>
              {documentMetadata && (
                <View style={styles.metadataContainer}>
                  <MetadataItem label="Name" value={documentMetadata.name} />
                  <MetadataItem label="Type" value={documentMetadata.type} />
                  <MetadataItem label="Size" value={documentMetadata.size} />
                  <MetadataItem label="Last Modified" value={documentMetadata.lastModified} />
                </View>
              )}
              <Text style={styles.sectionTitle}>Additional Information</Text>
              <TextInput
                style={styles.input}
                placeholder="Document Description"
                multiline
              />
              <TextInput
                style={styles.input}
                placeholder="Signing Purpose"
              />
              <TouchableOpacity style={styles.actionButton} onPress={handleSign}>
                <Text style={styles.actionButtonText}>Proceed to Sign</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        );
      case 'sign':
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.sectionTitle}>Sign Document</Text>
            <View style={styles.signatureArea}>
              <Text style={styles.signatureText}>Your Signature Here</Text>
            </View>
            <TouchableOpacity style={styles.actionButton} onPress={handleFinishSigning}>
              <Text style={styles.actionButtonText}>Finish Signing</Text>
            </TouchableOpacity>
          </View>
        );
      case 'share':
        return (
          <View style={styles.stepContainer}>
            <Ionicons name="checkmark-circle" size={64} color="#4CAF50" />
            <Text style={styles.successText}>Document Signed Successfully!</Text>
            <View style={styles.buttonGroup}>
              <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
                <Ionicons name="share-outline" size={24} color="#FFFFFF" />
                <Text style={styles.shareButtonText}>Share</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
                <Ionicons name="download-outline" size={24} color="#FFFFFF" />
                <Text style={styles.downloadButtonText}>Download</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Digital Document Signing</Text>
      {renderStep()}
    </View>
  );
}

function MetadataItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metadataItem}>
      <Text style={styles.metadataLabel}>{label}:</Text>
      <Text style={styles.metadataValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  stepContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  scrollView: {
    width: '100%',
  },
  uploadButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E1E1E1',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    aspectRatio: 1,
  },
  uploadText: {
    marginTop: 10,
    fontSize: 18,
    color: '#007AFF',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    alignSelf: 'flex-start',
  },
  metadataContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  metadataItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  metadataLabel: {
    fontWeight: 'bold',
    color: '#555',
  },
  metadataValue: {
    color: '#333',
  },
  input: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  actionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signatureArea: {
    width: '100%',
    height: 200,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
    borderRadius: 5,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signatureText: {
    color: '#999',
    fontSize: 18,
  },
  successText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginVertical: 20,
    textAlign: 'center',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  shareButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  downloadButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});
